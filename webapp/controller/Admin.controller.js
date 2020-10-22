sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"../utility/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet"
], function (Controller, MessageToast, UIComponent, MessageBox, Fragment, formatter, JSONModel, Spreadsheet) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Admin", {
		formatter: formatter,
		onInit: function () {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oFormModel = this.getOwnerComponent().getModel("oFormModel");
			var oMeetingData = {
				"purpose": "",
				"date": "",
				"beginTime": "",
				"endTime": "",
				"capacity": "",
				"rId": "",
				"facility": ""
			};
			oFormModel.setProperty("/oMeetingData", oMeetingData);
			var oFormData = {
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": "",
				"organisation": "",
				"proofType": "",
				"proofNo": "",
				"locality": "",
				"pId": ""
			};
			oFormModel.setProperty("/oFormData", oFormData);
			var addvisitorData = {
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": " ",
				"proofType": "",
				"proofNo": "",
				"locality": "",
				"organisation": "",
				"parkingType": "",
				"pId": ""
			};
			oFormModel.setProperty("/addvisitorData", addvisitorData);
			var visitors = [];
			oFormModel.setProperty("/Visitors", visitors);
			var oViewData = {
				newdate: new Date()
			};
			var oModel = new JSONModel(oViewData);
			this.getView().setModel(oModel, "oViewModel");
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
			var sUrl7 = "/VMS/rest/employeeController/listAllEmployee";
			this.fndoajax(sUrl7, "/EmployeesList");
			var eId = 5;
			var sUrl8 = "/VMS/rest/visitorController/notificationCounter?eId=" + eId;
			var count;
			$.ajax({
				url: sUrl8,
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
					console.log(data);
					count = data.data;
					var countupdated = count.toString();
					oAdminModel.setProperty("/Notificationcount", countupdated);
					console.log(countupdated);
					console.log(oAdminModel);

				},
				type: "GET"
			});
			// var sUrl5 = "";
			// this.fndoajax(sUrl5, "/FrequentVisits");
			var sUrl10 = "/VMS/rest/meetingController/getPurposePercent";
			var sUrl11 = "/VMS/rest/visitorController/getOrganisationPercent";
			this.fndoajax(sUrl10, "/PurposePercent");
			this.fndoajax(sUrl11, "/OrganisationPercent");
			console.log(oAdminModel);
			var sUrl13 = "wss://vmsprojectp2002479281trial.hanatrial.ondemand.com/vmsproject/chat/" + eId;
			var that = this;
			// var sUrl1 = "/VMS_Service/chat/1";
			var webSocket = new WebSocket(sUrl13);
			webSocket.onerror = function (event) {
				// alert(event.data);

			};
			webSocket.onopen = function (event) {
				// alert(event.data);

			};
			webSocket.onmessage = function (event) {
				// console.log("sarath");
				// alert(event.data);
				var jsonData = event.data;
				console.log(jsonData);
				var msg = JSON.parse(jsonData);
				console.log(msg);
				if (msg.content !== "Connected!") {
					var count1 = oAdminModel.getProperty("/Notificationcount");
					var count2 = parseInt(count1, 10);
					count2 = count2 + 1;
					var countupdated = count2.toString();
					oAdminModel.setProperty("/Notificationcount", countupdated);
					MessageBox.information(msg.content);
					that.fndoajax(sUrl1, "/CheckInDetails");
					that.fndoajax(sUrl4, "/Details");
				}

			};
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
		onUserPress: function (oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("idUser", "com.incture.VMS.fragment.user", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		oViewReportsPress: function () {
			this.byId("pageContainer").to(this.getView().createId("idReports"));
		},
		fnGetNotificationsData: function () {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			// var eId = oAdminModel.getProperty("/userDetails").eId;
			var eId = 5;
			var sUrl = "/VMS/rest/visitorController/getAllNotifications?eId=" + eId;
			console.log(sUrl);
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
					// console.log(data);
					oHostModel.setProperty("/notificationList", data);
					console.log(oHostModel);

				},
				type: "GET"
			});
		},
		onNotificationPress: function (oEvent) {
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			this.fnGetNotificationsData();
			if (!this._oPopover1) {
				this._oPopover1 = sap.ui.xmlfragment("idNotifications", "com.incture.VMS.fragment.notification", this);
				this.getView().addDependent(this._oPopover1);
			}
			this._oPopover1.openBy(oEvent.getSource());
			var count = oAdminModel.getProperty("/Notificationcount");
			count = "0";
			oAdminModel.setProperty("/Notificationcount", count);
		},
		onItemClose: function (oEvent) {
			// var oSecurityModel = this.getView().getModel("oSecurityModel");
			var that = this;
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getBindingContextPath();
			var obj = oHostModel.getProperty(spath);
			var sUrl = "/VMS/rest/employeeController/close?nId=" + obj.nId;
			$.ajax({
				url: sUrl,
				type: "POST",
				data: null,

				dataType: "json",
				success: function (data, status, response) {
					that.fnGetNotificationsData();
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		onAcceptPress: function (oEvent) {
			var that = this;
			var oHostModel = this.getView().getModel("oHostModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getParent().getBindingContextPath();
			var obj = oHostModel.getProperty(spath);
			console.log(obj);
			var dId = obj.dId;
			var nId = obj.nId;
			var mId = obj.mId;
			// "mId": obj.mId,
			// 	"action": "accept",
			// 	"nId": obj.nId
			if (obj.title === "Delivery Request") {
				$.ajax({
					url: "/VMS/rest/employeeController/acceptDelivery?dId=" + dId + "&nId=" + nId,
					type: "POST",
					data: null,
					// data: {
					// 	"dId": obj.dId,
					// 	"nId": obj.nId
					// },

					dataType: "json",
					contentType: "application/json; charset=utf-8",
					success: function (data, status, response) {
						if (data.status === 200) {
							sap.m.MessageToast.show("Delivery Accepted");
							that.fnGetNotificationsData();
						} else if (data.status === 300) {
							MessageBox.information("Your Delivery Needs Signature");
						} else {
							sap.m.MessageToast.show("Something Went Wrong");
						}

					},
					error: function (e) {
						sap.m.MessageToast.show("fail");

					}
				});
			} else {
				$.ajax({
					url: "/VMS/rest/employeeController/acceptOnSpotVisitor?eId=5&nId=" + nId + "&comment=accept",
					type: "POST",
					data: null,
					// data: {
					// 	"mId": obj.mId,
					// 	"action": "accept",
					// 	"nId": obj.nId
					// },

					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					success: function (data, status, response) {

						if (data.status === 200) {
							sap.m.MessageToast.show("Meeting Accepted");
							that.fnGetNotificationsData();
						} else {
							sap.m.MessageToast.show("Something Went Wrong");
						}

					},
					error: function (e) {
						sap.m.MessageToast.show("fail");

					}
				});
			}

			that.fnGetNotificationsData();
		},
		onRejectPress: function (oEvent) {
			var oHostModel = this.getView().getModel("oHostModel");
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getParent().getBindingContextPath();
			var obj = oHostModel.getProperty(spath);
			console.log(obj);
			var dId = obj.dId;
			var nId = obj.nId;
			var mId = obj.mId;
			if (obj.title === "Delivery Request") {
				$.ajax({
					url: "/VMS/rest/employeeController/acceptDelivery?dId=" + dId + "&nId=" + nId,
					type: "POST",
					data: null,
					// data: {
					// 	"dId": obj.dId,
					// 	"nId": obj.nId
					// },

					dataType: "json",
					contentType: "application/json; charset=utf-8",
					success: function (data, status, response) {
						sap.m.MessageToast.show("Delivery Rejected");
					},
					error: function (e) {
						sap.m.MessageToast.show("fail");

					}
				});
			} else {
				$.ajax({
					url: "/VMS/rest/employeeController/acceptOnSpotVisitor?eId=5&nId=" + nId + "&comment=reject",
					type: "POST",
					data: null,
					// data: {
					// 	"mId": obj.mId,
					// 	"action": "reject",
					// 	"nId": obj.nId
					// },

					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					success: function (data, status, response) {
						sap.m.MessageToast.show("Meeting Rejected");

					},
					error: function (e) {
						sap.m.MessageToast.show("fail");

					}
				});
			}

			this.fnGetNotificationsData();
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
			var oAdminModel = this.getView().getModel("oAdminModel");
			var date = oAdminModel.getProperty("/date");
			var sUrl1 = "/VMS/rest/visitorController/getVisitorCheckIn?eid=5&Date=" + date;
			that.fndoajax(sUrl1, "/CheckInDetails");
			console.log(sUrl1);
			var sUrl4 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl4, "/Details");
			console.log(oAdminModel);
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
			var oAdminModel = this.getView().getModel("oAdminModel");
			var date = oAdminModel.getProperty("/date");
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=5&Date=" + date;
			that.fndoajax(sUrl2, "/CheckOutDetails");
			var sUrl4 = "/VMS/rest/visitorController/getAllVisitorHistory?date=" + date;
			this.fndoajax(sUrl4, "/Details");
			console.log(oAdminModel);
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
			// console.log();
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
		onAvailabilityPress: function () {
			var that = this;
			var oFormModel = that.getView().getModel("oFormModel");
			var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var capacity = oMeetingData.capacity;
			var date = oMeetingData.date;
			var beginTime = oMeetingData.beginTime;
			var endTime = oMeetingData.endTime;
			// var payload = {
			// 	"date": oMeetingData.date,
			// 	"beginTime": oMeetingData.beginTime,
			// 	"endTime": oMeetingData.endTime,
			// 	"capacity": oMeetingData.capacity
			// };
			// console.log(payload);
			$.ajax({
				url: "/VMS/rest/meetingRoomController/checkMeetingRoomAvailability?begin=" + date + " " + beginTime + "&end=" + date + " " +
					endTime + "&capacity=" + capacity,
				type: "GET",
				data: null,
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				// dataType: "json",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Success");
					console.log(data);
					oFormModel.setProperty("/AvailableRooms", data);
					console.log(status);
					console.log(response);

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("Something went wrong.Please try agian");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

			Fragment.byId("idPreRegistrationFrag", "idRoomAvailability").setVisible(true);
		},
		onParkingAvailabilityPress: function () {
			var that = this;
			var oFormModel = that.getView().getModel("oFormModel");
			// var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var oFormData = oFormModel.getProperty("/oFormData");
			var parkingType = oFormData.parkingType;
			// var payload = {
			// 	"date": oMeetingData.date,
			// 	"beginTime": oMeetingData.beginTime,
			// 	"endTime": oMeetingData.endTime,
			// 	"parkingType": oFormData.parkingType

			// };
			$.ajax({
				url: "/VMS/rest/parkingSlotController/checkAvailableParkingSlot?vehicleType=" + parkingType,
				type: "GET",
				data: null,

				success: function (data, status, response) {
					// sap.m.MessageToast.show("Success");
					console.log(data);
					oFormModel.setProperty("/AvailableParkingSlots", data);
					console.log(status);
					console.log(response);

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("Something went wrong.Please try again");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});
			Fragment.byId("idPreRegistrationFrag", "idParkingAvailability").setVisible(true);
		},
		onRegisterMain: function () {
			var that = this;
			var sUrl1 = "/VMS/rest/meetingController/getAllUpcomingMeeting?eid=5";
			var sUrl2 = "/VMS/rest/visitorController/getPreregistredVisitors?eid=5";
			var oFormModel = that.getView().getModel("oFormModel");
			var oAdminModel = that.getView().getModel("oAdminModel");
			var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var oFormData = oFormModel.getProperty("/oFormData");
			// var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 	pattern: "MMM dd, yyyy"
			// });
			// var date = oMeetingData.date;
			// var newdate = oDateFormat.format(date);
			// var eId = oAdminModel.getProperty("/userDetails").eId;
			console.log(oFormData);
			console.log(oMeetingData);
			var visitors = oFormModel.getProperty("/Visitors");
			visitors.push(oFormData);
			oFormModel.setProperty("/Visitors", visitors);
			console.log(visitors);
			var payload = {
				"purpose": oMeetingData.purpose,
				"comments": "developer",
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"eId": 5,
				"rId": oMeetingData.rId,
				"date": oMeetingData.date,
				// "facility": facilities,
				// "capacity": oMeetingData.capacity,
				"visitors": visitors
					// "purpose": "interview",
					// "comments": "developer",
					// "beginTime": "14:30:00",
					// "endTime": "15:00:00",
					// "eId": 4,
					// "rId": 1,
					// "date": "sep 29, 2020",
					// "visitors": [{
					// 	"firstName": "abc",
					// 	"lastName": "def",
					// 	"email": "rohithv63@gmail.com",
					// 	"contactNo": "7025508696",
					// 	"organisation": "TCS",
					// 	"proofType": "aadhar",
					// 	"proofNo": "asdfghhk",
					// 	"locality": "kerala",
					// 	"pId": 1
					// }]
			};
			console.log(payload);
			var oDialog = new sap.m.BusyDialog();
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 3000);

			$.ajax({
				url: "/VMS/rest/visitorController/preRegister",
				type: "POST",
				data: JSON.stringify(payload),
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Successfully Pre-Registered");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
					} else if (data.status === 300) {
						sap.m.MessageToast.show("Having a Meeting Clash");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					} else {
						sap.m.MessageToast.show("Something Went Wrong..please try again");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					}
					console.log(status);
					console.log(response);
					oFormModel.setProperty("/oMeetingData", {});
					oFormModel.setProperty("/oFormData", {});
					oFormModel.setProperty("/Visitors", []);
					// that._oDialog1.close();
					// that._oDialog1.destroy();
					// that._oDialog1 = null;
					that.fndoajax(sUrl1, "/UpcomingMeetings");
					that.fndoajax(sUrl2, "/PreRegistration");
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});

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
			var payload = {
				"meetingId": obj.mid,
				"visitorId": obj.visitorId,
				"employeeId": 5,
				"reason": sRemarks
			};
			console.log(JSON.stringify(payload));
			$.ajax({
				url: "/VMS/rest/blackListController/addBlackList",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
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
					sap.m.MessageToast.show("Please try Again");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

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
		onAddVisitors: function () {
			var that = this;
			if (!that._oDialog1) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog1 = sap.ui.xmlfragment("idAddVisitorsFrag",
					"com.incture.VMS.fragment.Addvisitors",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog1); // Adding the fragment to your current view
			that._oDialog1.open();
		},
		onCanceladd: function () {
			this._oDialog1.close();
			this._oDialog1.destroy();
			this._oDialog1 = null;
		},
		onSendAlertPress: function () {
			this.bFlag = true;
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idsendAlertFragAdmin", "com.incture.VMS.fragment.sendAlert", this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			this._oDialog.open();
		},
		onSendEvacuation: function () {
			var that = this;
			var oAdminModel = that.getView().getModel("oAdminModel");
			var aSelectedPaths = that.getView().byId("idAdminEvacuationtable").getSelectedContextPaths();
			var aSelectedPathsHosts = that.getView().byId("idEmoloyeestable").getSelectedContextPaths();
			// var sType = Fragment.byId("idsendAlertFragAdmin", "idRadio").getSelectedButton().getText();
			var sMessage = Fragment.byId("idsendAlertFragAdmin", "idtarea").getValue();

			var aEmailList = [];
			var aEmailListHost = [];
			var item;
			var item2;
			var item3;
			for (var i = 0; i < aSelectedPaths.length; i++) {
				item = aSelectedPaths[i];
				var obj = oAdminModel.getProperty(item);
				aEmailList.push(obj.visitorEmail);
				console.log(obj.visitorEmail);

			}
			for (var j = 0; j < aSelectedPathsHosts.length; j++) {
				item2 = aSelectedPathsHosts[j];
				var obj2 = oAdminModel.getProperty(item2);
				aEmailListHost.push(obj2.employeeEmail);
				console.log(obj2.employeeEmail);

			}
			console.log(aEmailListHost);
			for (var k = 0; k < aEmailListHost.length; k++) {
				item3 = aEmailListHost[k];
				aEmailList.push(item3);
			}
			// aEmailList.push(aEmailListHost);
			console.log(aEmailList);
			var payload = {
				"emailList": aEmailList,
				"message": sMessage
			};
			console.log(JSON.stringify(payload));
			// var oTokenModel = that.getView().getModel("oTokenModel");
			// var oToken = oTokenModel.getData();
			// var token = oToken.csrftoken;
			$.ajax({
				url: "/VMS/rest/visitorController/emergencyMessage",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully Sent Alert");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					console.log(response);
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					// that.fnGetData();

				},
				error: function (response) {
					console.log(response);
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});
			that._oDialog.close();
			that._oDialog.destroy();
			that._oDialog = null;
		},
		onEditProfilePress: function () {
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idEditProfileFrag", "com.incture.VMS.fragment.editProfile",
					this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();
		},
		onEditProfileConfirm: function () {
			var that = this;
			var oLoginModel = that.getOwnerComponent().getModel("oLoginModel");
			// var obj = oLoginModel.getProperty("/oLoginFormData");
			var obj = oLoginModel.getProperty("/loginDetails");
			// var oSecurityModel = that.getView().getModel("oSecurityModel");
			var eId = oLoginModel.getProperty("/loginDetails").eId;
			var payload = {
				"employeeId": obj.username,
				"password": obj.password,
				"employeeEmail": obj.email,
				"employeePhoneNumber": obj.contactNo
			};
			$.ajax({
				url: "/VMS/rest/employeeController/updateEmployee?id=" + eId,
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully Edited");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					console.log(response);
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");
					$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");

				}
			});

		},
		onExport: function () {
			var oAdminModel = this.getView().getModel("oAdminModel");
			var date = oAdminModel.getProperty("/date");
			var sUrl = "/VMS/rest/visitorController/downloadPDF?date=" + date;
			console.log(sUrl);
			sap.m.URLHelper.redirect(sUrl, true);
		},
		onLogOutPress: function () {
			var eId = 5;
			var sUrl = "wss://vmsprojectp2002479281trial.hanatrial.ondemand.com/vmsproject/chat/" + eId;
			var webSocket = new WebSocket(sUrl);
			webSocket.close();
			sap.m.MessageToast.show("Successfully LoggedOut");
			$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
			this.getRouter().navTo("RouteHome");
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