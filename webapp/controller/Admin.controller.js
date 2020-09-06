sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Admin", {

		onInit: function () {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			oAdminModel.setProperty("/date", newdate);
			var sUrl1 = "/VMS/admin/getCheckedInVisitors?date=" + newdate;
			this.fndoajax(sUrl1, "/CheckInDetails");
			var sUrl2 = "/VMS/admin/getCheckedOutVisitors?date=" + newdate;
			this.fndoajax(sUrl2, "/CheckOutDetails");
			var sUrl3 = "/VMS/admin/getExpectedVisitors?date=" + newdate;
			this.fndoajax(sUrl3, "/ExpectedVisitorDetails");
			var sUrl4 = "/VMS/rest/visitorController/selectAllVisitor?date=" + newdate;
			this.fndoajax(sUrl4, "/Details");
			// var sUrl5 = "";
			// this.fndoajax(sUrl5, "/FrequentVisits");
			console.log(oAdminModel);
		},
		onDate: function () {
			var that = this;
			var date = that.getView().byId("date").getValue();
			console.log(date);
			var oAdminModel = that.getOwnerComponent().getModel("oAdminModel");
			oAdminModel.setProperty("/date", date);
			var sUrl4 = "/VMS/rest/visitorController/selectAllVisitor?date=" + date;
			this.fndoajax(sUrl4, "/Details");
			console.log(oAdminModel);
		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},
		onPressImage: function () {

			this.getRouter().navTo("RouteHome");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onMenuPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId("sideNavigationToggleButton");
			if (bLarge) {
				oToggleButton.setTooltip("Large Size Navigation");
			} else {
				oToggleButton.setTooltip("Small Size Navigation");
			}
		},
		onCheckInPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(true);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(false);
			this.getView().byId("idFrequentVisitsTable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idFrequentVisits").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").addStyleClass("HomeStyleTile");
		},
		onCheckOutPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(true);
			this.getView().byId("idYetToVisitTable").setVisible(false);
			this.getView().byId("idFrequentVisitsTable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").addStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idFrequentVisits").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
		onYetToVisitPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(true);
			this.getView().byId("idFrequentVisitsTable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").addStyleClass("HomeStyleTile");
			this.getView().byId("idFrequentVisits").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
		onFrequentVisitsPress: function () {
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(false);
			this.getView().byId("idFrequentVisitsTable").setVisible(true);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idFrequentVisits").addStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
		onShowFrequentVisitorsPress: function (oEvent) {
			var that = this;
			var oAdminModel = that.getView().getModel("oAdminModel");
			var spath = oEvent.getSource().getParent().getBindingContextPath();
			var aVisitorList = oAdminModel.getProperty(spath).visitors;
			oAdminModel.setProperty("/FrequentVisitors", aVisitorList);
			console.log(aVisitorList);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idFrequentVisitsFragAdmin", "com.incture.VMS.fragment.displayFrequentVisits",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog);
		},
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		fndoajax: function (sUrl, sProperty) {
			var that = this;
			var oAdminModel = that.getOwnerComponent().getModel("oAdminModel");
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				headers: {
					dataType: "json",
					contentType: "application/json; charset=utf-8"

				},
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");
					oAdminModel.setProperty(sProperty, data);

				},
				type: "GET"
			});
		}

	});

});