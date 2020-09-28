sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Home", {
		onInit: function () {
			var oLoginFormData = {
				"username": "",
				"password": ""
			};
			var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
			oLoginModel.setProperty("/oLoginFormData", oLoginFormData);
		},
		onLogin: function () {
			var oDialog = new sap.m.BusyDialog();
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 3000);
			var that = this;
			var oLoginModel = that.getView().getModel("oLoginModel");
			var obj = oLoginModel.getProperty("/oLoginFormData");
			if(obj.username === "admin"){
				this.getRouter().navTo("AdminDetails");
			}
			if(obj.username === "host"){
				this.getRouter().navTo("HostDetails");
			}
			if(obj.username === "security"){
				this.getRouter().navTo("SecurityDetails");
			}
		},
		onParkingCheckInPress:function(){
			this.getView().byId("idParking").setVisible(false);
			this.getView().byId("idRegister").setVisible(true);
		},
		onParkingCheckOutPress:function(){
			this.getView().byId("idParking").setVisible(false);
			this.getView().byId("idCheckOut").setVisible(true);
		},
		/*onAdminPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("AdminDetails");
		},
		onSecurityPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("SecurityDetails");
		},
		onHostPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("HostDetails");
		},*/
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		}
	});
});