sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Security", {

		onInit: function () {
			var comboData = {
				"sSelect": "",
				"CheckedInVisibility": true,
				"CheckedOutVisibility": false,
				"YetToVisitVisibility": false
			};
			var oModel1 = new JSONModel(comboData);
			this.getView().setModel(oModel1, "oViewModel");
			var oSecurityModel = this.getOwnerComponent().getModel("oSecurityModel");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			oSecurityModel.setProperty("/date", newdate);
			var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + newdate;
			this.fndoajax(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=6&Date=" + newdate;
			console.log(sUrl2);
			this.fndoajax(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + newdate;
			console.log(sUrl3);
			this.fndoajax(sUrl3, "/CheckOutDetails");
			var sUrl4 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + newdate;
			this.fndoajax(sUrl4, "/ExpectedVisitorDetails");

			var sUrl5 = "/VMS/rest/blackListController/selectAllBlackList";
			this.fndoajax(sUrl5, "/BlackListed");
			console.log(oSecurityModel);

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
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
			oSecurityModel.setProperty("/date", date);
			var sUrl1 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=6&Date=" + date;
			this.fndoajax(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=6&Date=" + date;
			this.fndoajax(sUrl3, "/CheckOutDetails");
			var sUrl4 = "/VMS/rest/visitorController/getExpectedVisitors?date=" + date;
			this.fndoajax(sUrl4, "/ExpectedVisitorDetails");

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
			this.getView().byId("idCheckout").addStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").removeStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
		onYetToVisitPress: function () {
			var that = this;
			this.getView().byId("idCheckInTable").setVisible(false);
			this.getView().byId("idCheckOutTable").setVisible(false);
			this.getView().byId("idYetToVisitTable").setVisible(true);

			this.byId("pageContainer").to(this.getView().createId("idFilters"));
			this.getView().byId("idCheckout").removeStyleClass("HomeStyleTile");
			this.getView().byId("idYettovisit").addStyleClass("HomeStyleTile");
			this.getView().byId("idCheckin").removeStyleClass("HomeStyleTile");
		},
			onAddToBlacklist: function (oEvent) {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var oSource = oEvent.getSource();
			oSecurityModel.setProperty("/BlackListedSource", oSource);
			var spath = oSource.getParent().getBindingContextPath();
			oSecurityModel.setProperty("/BlackListedPath", spath);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idaddBlackListVisitorFrag", "com.incture.VMS.fragment.addBlackListVisitor", this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog);
			that._oDialog.open();
	},
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
			onConfirmBlackList: function () {
			var that = this;
			var oSecurityModel = that.getView().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			var sUrl1 = "/VMS/rest/blackListController/selectAllBlackList";
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var spath = oSecurityModel.getProperty("/BlackListedPath");
			console.log(spath);
			var obj = oSecurityModel.getProperty(spath);
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
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
			var date = oSecurityModel.getProperty("/date");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			var sUrl3 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			var oTableModel = this.getView().byId("idCheckOutTable").getModel("oSecurityModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getBindingContextPath();
			var obj = oSecurityModel.getProperty(spath);
			var bId = obj.bId;
			$.ajax({
				url: "/VMS/rest/blackListController/removeFromBlackList?id=" + bId,
				type: "POST",
				data: null,
				dataType: 'json',
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
		fndoajax: function (sUrl, sProperty) {
			var that = this;
			var oSecurityModel = that.getOwnerComponent().getModel("oSecurityModel");
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
					oSecurityModel.setProperty(sProperty, data);

				},
				type: "GET"
			});
		}

	});

});