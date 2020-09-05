sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Home", {
		onInit: function () {

		},
		onAdminPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("AdminDetails");
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		}
	});
});