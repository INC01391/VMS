sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"../utility/formatter"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment, formatter) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Admin", {
		formatter: formatter,
		onInit: function () {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			oAdminModel.setProperty("/date", newdate);
			var sUrl1 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=5&Date=" + newdate;
			console.log(sUrl1);
			this.fndoajax(sUrl1, "/CheckInDetails");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + newdate;
			console.log(sUrl2);
			this.fndoajax(sUrl2, "/CheckOutDetails");
			var sUrl3 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + newdate;
			this.fndoajax(sUrl3, "/ExpectedVisitorDetails");
			var sUrl4 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + newdate;
			this.fndoajax(sUrl4, "/Details");
			var sUrl5 = "/VMS/rest/visitorController/getFrequentVisitors";
			this.fndoajax(sUrl5, "/FrequentVisits");
			var sUrl6 = "/VMS/rest/blackListController/selectAllBlackList";
			this.fndoajax(sUrl6, "/BlackListed");
			// var sUrl5 = "";
			// this.fndoajax(sUrl5, "/FrequentVisits");
			console.log(oAdminModel);
		},
		onDate: function () {
			var oDialogb = new sap.m.BusyDialog();
			oDialogb.open();
			setTimeout(function () {
				oDialogb.close();
			}, 3000);
			var that = this;
			var date = that.getView().byId("date").getValue();
			console.log(date);
			var oAdminModel = that.getOwnerComponent().getModel("oAdminModel");
			oAdminModel.setProperty("/date", date);
			var sUrl1 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=5&Date=" + date;
			this.fndoajax(sUrl1, "/CheckInDetails");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			this.fndoajax(sUrl2, "/CheckOutDetails");
			var sUrl3 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + date;
			this.fndoajax(sUrl3, "/ExpectedVisitorDetails");
			var sUrl4 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl4, "/Details");
			var sUrl5 = "/VMS/rest/visitorController/getVisitorHistory?eid=5&Date=" + date;
			this.fndoajax(sUrl5, "/AdminVisitors");
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
			that._oDialog.open();
		},
		onShowUpcomingVisitorsPress: function (oEvent) {
			var that = this;
			var oAdminModel = that.getView().getModel("oAdminModel");
			var spath = oEvent.getSource().getParent().getBindingContextPath();
			var aVisitorList = oAdminModel.getProperty(spath).visitors;
			oAdminModel.setProperty("/UpcomingVisitors", aVisitorList);
			// console.log(aVisitorList);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idFrequentVisitsFragAdmin",
					"com.incture.VMS.fragment.displayFrequentVisits",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog); // Adding the fragment to your current view
			Fragment.byId("idFrequentVisitsFragAdmin", "idFrequentVisitors").setVisible(false);
			Fragment.byId("idFrequentVisitsFragAdmin", "idUpcomingVisitorsAdmin").setVisible(true);
			Fragment.byId("idFrequentVisitsFragAdmin", "idUpcomingVisitorsHost").setVisible(false);
			that._oDialog.open();
		},
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		onUpcomingPress: function () {
			this.getView().byId("idUpcomingMeetingsTable").setVisible(true);
			this.getView().byId("preregisteredtable").setVisible(false);
			this.byId("pageContainer").to(this.getView().createId("idUpcomingMeetings"));
			this.getView().byId("idPreRegistration").removeStyleClass("HomeStyleTile");
			this.getView().byId("idUpcoming").addStyleClass("HomeStyleTile");
			var oAdminModel = this.getView().getModel("oAdminModel");
			var sUrl1 = "/VMS/rest/meetingController/getAllUpcomingMeeting?eid=5";
			this.fndoajax(sUrl1, "/UpcomingMeetings");
			console.log(oAdminModel);
		},
		onPreregistrationPress: function () {
			this.getView().byId("idUpcomingMeetingsTable").setVisible(false);
			this.getView().byId("preregisteredtable").setVisible(true);
			this.byId("pageContainer").to(this.getView().createId("idUpcomingMeetings"));
			this.getView().byId("idUpcoming").removeStyleClass("HomeStyleTile");
			this.getView().byId("idPreRegistration").addStyleClass("HomeStyleTile");
			var oAdminModel = this.getView().getModel("oAdminModel");
			var sUrl1 = "/VMS/rest/visitorController/getPreregistredVisitors?eid=5";
			this.fndoajax(sUrl1, "/PreRegistration");
		},
		onAddToBlacklist: function (oEvent) {
			var that = this;
			var oAdminModel = that.getView().getModel("oAdminModel");
			var oSource = oEvent.getSource();
			oAdminModel.setProperty("/BlackListedSource", oSource);
			var spath = oSource.getParent().getBindingContextPath();
			oAdminModel.setProperty("/BlackListedPath", spath);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idaddBlackListVisitorFrag", "com.incture.VMS.fragment.addBlackListVisitor", this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog);
			that._oDialog.open();
		},
		onConfirmBlackList: function () {
			var that = this;
			var oAdminModel = that.getView().getModel("oAdminModel");
			var date = oAdminModel.getProperty("/date");
			var sUrl1 = "/VMS/rest/blackListController/selectAllBlackList";
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var spath = oAdminModel.getProperty("/BlackListedPath");
			console.log(spath);
			var obj = oAdminModel.getProperty(spath);
			console.log(obj);
			var sRemarks = Fragment.byId("idaddBlackListVisitorFrag", "idTarea").getValue();
			// var payload={
			// 	"eId": obj.eId
			// };
			$.ajax({
				url: "/VMS/rest/blackListController/addBlackList",
				type: "POST",
				data: {
					"eId": obj.eId,
					"vId": obj.vId,
					"remarks": sRemarks,
					"vhId": obj.vhId
				},
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				dataType: "json",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully BlackListed");

					console.log(response);
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					var oDialogb = new sap.m.BusyDialog();
					oDialogb.open();
					setTimeout(function () {
						oDialogb.close();
					}, 3000);
					that.fndoajax(sUrl2, "/CheckOutDetails");
					that.fndoajax(sUrl1, "/BlackListed");
					that.fndoajax(sUrl3, "/Details");
					// oSource.setEnabled(false);
					if (data.status === 300) {
						MessageBox.warning("Already Blacklisted");
					}

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		onPressUnblock: function (oEvent) {
			var sUrl = "/VMS/rest/blackListController/selectAllBlackList";
			var that = this;
			var oAdminModel = that.getOwnerComponent().getModel("oAdminModel");
			var date = oAdminModel.getProperty("/date");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var oTableModel = this.getView().byId("idCheckOutTable").getModel("oAdminModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getBindingContextPath();
			var obj = oAdminModel.getProperty(spath);
			var bId = obj.bId;
			console.log(bId);
			$.ajax({
				url: "/VMS/rest/blackListController/removeFromBlackList?id=" + bId,
				type: "POST",
				data: null,
				// dataType: 'json',
				success: function (data, status, response) {
					console.log(data);
					sap.m.MessageToast.show("Successfully Unblocked");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					that.fndoajax(sUrl, "/BlackListed");
					that.fndoajax(sUrl2, "/CheckOutDetails");
					that.fndoajax(sUrl3, "/Details");
					oTableModel.refresh();
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

		},
		onAddNewPress: function () {
			var that = this;
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idPreRegistrationFrag",
					"com.incture.VMS.fragment.addPreregistration",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog); // Adding the fragment to your current view
			that._oDialog.open();
		},
		// 	onAddVisitors: function() 
		// 	{
		// 		var that = this;
		// 		if (!that._oDialog) {
		// 			//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
		// 			that._oDialog = sap.ui.xmlfragment("idAddVisitorsFrag",
		// 				"com.incture.VMS.fragment.Addvisitors",
		// 				this); // Instantiating the Fragment
		// }
		// 					that.getView().addDependent(that._oDialog); // Adding the fragment to your current view
		// 		that._oDialog.open();
		// 	},
		onSendAlertPress: function () {
			this.bFlag = true;
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idsendAlertFragAdmin", "com.incture.VMS.fragment.sendAlert", this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			this._oDialog.open();
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
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
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