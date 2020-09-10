sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"../utility/formatter"
], function (Controller, UIComponent, MessageBox, Fragment, formatter) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Host", {
		formatter: formatter,

		onInit: function () {
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			oHostModel.setProperty("/date", newdate);
			var eId = 4;
			var sUrl1 = "/VMS/rest/visitorController/getVisitorHistory?eid=" + eId + "&Date=" + newdate;
			this.fnGetData(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=" + eId + "&Date=" + newdate;
			this.fnGetData(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=" + eId + "&Date=" + newdate;
			this.fnGetData(sUrl3, "/CheckOutDetails");
			// var sUrl4 ="";
			// this.fnGetData(sUrl4, "/ExpectedVisitorDetails");
			var sUrl5 ="/VMS/rest/blackListController/selectAllBlackListByEmployee?eid=2";
			this.fnGetData(sUrl5, "/BlackListed");
			console.log(oHostModel);

		},
		onDate: function () {
			var oDialog = new sap.m.BusyDialog();
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 3000);
			var that = this;
			var date = that.getView().byId("date").getValue();
			console.log(date);
			var oHostModel = that.getOwnerComponent().getModel("oHostModel");
			oHostModel.setProperty("/date", date);
			var eId = 4;
			var sUrl1 = "/VMS/rest/visitorController/getVisitorHistory?eid=" + eId + "&Date=" + date;
			this.fnGetData(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=" + eId + "&Date=" + date;
			this.fnGetData(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=" + eId + "&Date=" + date;
			this.fnGetData(sUrl3, "/CheckOutDetails");
			// var sUrl4 ="";
			// this.fnGetData(sUrl4, "/ExpectedVisitorDetails");
			console.log(oHostModel);
		},
		onImagePress: function () {

			this.getRouter().navTo("RouteHome");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
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
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").addStyleClass("HomeStyleTile");
		},
		onCheckOutPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(true);
			this.getView().byId("idYetToVisitTable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckout").addStyleClass("HomeStyleTile");
		},
		onYetToVisitPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(true);
			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").addStyleClass("HomeStyleTile");
		},
		onUpcomingPress: function () {
			this.getView().byId("idUpcomingMeetingsTable").setVisible(true);
			this.getView().byId("preregisteredtable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idUpcomingMeetings"));
			this.getView().byId("idPreRegistration").removeStyleClass("HomeStyleTile");
			this.getView().byId("idUpcoming").addStyleClass("HomeStyleTile");
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			var eId = 4;
			// var eId = oHostModel.getProperty("/userDetails").eId;
			var date = oHostModel.getProperty("/date");
			var sUrl = "/VMS/rest/meetingController/getAllUpcomingMeeting?eid=" + eId;
			this.fnGetData(sUrl, "/UpcomingMeetings");
			console.log(oHostModel);
		},
		onPreregistrationPress: function () {
			this.getView().byId("idUpcomingMeetingsTable").setVisible(false);
			this.getView().byId("preregisteredtable").setVisible(true);
			this.byId("pageContainer").to(this.getView().createId("idUpcomingMeetings"));
			this.getView().byId("idUpcoming").removeStyleClass("HomeStyleTile");
			this.getView().byId("idPreRegistration").addStyleClass("HomeStyleTile");
			// var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			// var eId = oHostModel.getProperty("/userDetails").eId;
			var eId = 4;
			var sUrl = "/VMS/rest/visitorController/getPreregistredVisitors?eid=" + eId;
			this.fnGetData(sUrl, "/PreRegistration");
		},
		onShowUpcomingVisitorsPress: function (oEvent) {
			var that = this;
			var oHostModel = that.getView().getModel("oHostModel");
			var spath = oEvent.getSource().getParent().getBindingContextPath();
			var aVisitorList = oHostModel.getProperty(spath).visitors;
			oHostModel.setProperty("/UpcomingVisitors", aVisitorList);
			// console.log(aVisitorList);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idFrequentVisitsFrag",
					"com.incture.VMS.fragment.displayFrequentVisits",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog); // Adding the fragment to your current view
			Fragment.byId("idFrequentVisitsFrag", "idFrequentVisitors").setVisible(false);
			Fragment.byId("idFrequentVisitsFrag", "idUpcomingVisitorsAdmin").setVisible(false);
			Fragment.byId("idFrequentVisitsFrag", "idUpcomingVisitorsHost").setVisible(true);
			that._oDialog.open();
		},
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		fnGetData: function (sUrl, sProperty) {
			var that = this;
			var oHostModel = that.getOwnerComponent().getModel("oHostModel");
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
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");
					oHostModel.setProperty(sProperty, data);

				},
				type: "GET"
			});
		}

	});

});