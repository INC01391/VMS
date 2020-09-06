sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment, formatter) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Host", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.incture.VMS.view.Host
		 */
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
			console.log(sUrl1);
			this.fnGetData(sUrl1, "/Details");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=" + eId + "&Date=" + newdate;
			this.fnGetData(sUrl2, "/CheckInDetails");
			var sUrl3 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=" + eId + "&Date=" + newdate;
			this.fnGetData(sUrl3, "/CheckOutDetails");
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
		},
		onImagePress: function () {

			this.getRouter().navTo("RouteHome");

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
		getRouter: function () {
			return UIComponent.getRouterFor(this);
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
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.incture.VMS.view.Host
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.incture.VMS.view.Host
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.incture.VMS.view.Host
		 */
		//	onExit: function() {
		//
		//	}

	});

});