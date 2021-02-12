/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as rolesActions from './roles-actions';
import fuLogger from '../../core/common/fu-logger';
import RolesView from '../../adminView/roles/roles-view';
import RolesModifyView from '../../adminView/roles/roles-modify-view';
import UserRolesModifyView from '../../adminView/roles/user-roles-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


class RolesContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
		} else {
			this.props.actions.init();
		}
	}

	getState = () => {
		return this.props.roles;
	}
	
	getForm = () => {
		return "ADMIN_ROLE_FORM";
	}
	
	onModifyPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onModifyPermissions',msg:"test"+item.id});
		this.props.history.push({pathname:'/admin-permissions',state:{parent:item}});
	}
	
	
	onUserRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleModify',msg:"test"+item.id});
		if (item.userRole != null) {
			this.props.actions.modifyUserRole({userRoleId:item.userRole.id,roleId:item.id,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyUserRole({roleId:item.id,appPrefs:this.props.appPrefs});
		}
	}
	
	onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.roles.prefForms.ADMIN_USER_ROLE_FORM,this.props.roles.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_NAME'};
			this.props.actions.saveRolePermission({state:this.props.roles});
		} else {
			this.props.actions.setErrors({errors:errors.errorMap});
		}
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		switch(code) {
			case 'MODIFY_USER_ROLE': {
				this.onUserRoleModify(item);
				break;
			}
			case 'MODIFY_PERMISSION': {
				this.onModifyPermissions(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'RolesContainer::render',msg:"Hi there"});
		if (this.props.roles.isModifyOpen) {
			return (
				<RolesModifyView
				itemState={this.props.roles}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				applicationSelectList={this.props.roles.applicationSelectList}/>
			);
		} else if (this.props.roles.isUserRoleOpen) {
			return (
				<UserRolesModifyView
				itemState={this.props.roles}
				appPrefs={this.props.appPrefs}
				onSave={this.onUserRoleSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.roles.items != null) {
			return (
				<RolesView 
				itemState={this.props.roles}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				goBack={this.goBack}
				session={this.props.session}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
 	}
}

RolesContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	roles: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, roles:state.roles, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(rolesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(RolesContainer);
