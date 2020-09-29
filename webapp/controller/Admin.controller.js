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
			var oFormModel = this.getOwnerComponent().getModel("oFormModel");
			var oMeetingData = {
				"purpose": "",
				"date": "",
				"beginTime": "",
				"endTime": "",
				"capacity": "",
				"rId": ""
					// "facility": "wifi,board"
			};
			oAdminModel.setProperty("/oMeetingData", oMeetingData);
			var visitorData = {
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
			oAdminModel.setProperty("/visitorData", visitorData);
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
			oAdminModel.setProperty("/addvisitorData", addvisitorData);
			var visitors = [];
			oAdminModel.setProperty("/Visitors", visitors);
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
			var payload = {
				"date": oMeetingData.date,
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"capacity": oMeetingData.capacity
			};
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/meetingRoomController/checkMeetingRoomAvailability?capacity=" + oMeetingData.capacity,
				type: "GET",
				data: null,
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				// dataType: "json",
				success: function (data, status, response) {
					// sap.m.MessageToast.show("Success");
					console.log(data);
					oAdminModel.setProperty("/AvailableRooms", data);
					console.log(status);
					console.log(response);

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});

			Fragment.byId("idPreRegistrationFrag", "idRoomAvailability").setVisible(true);
		},
		onParkingAvailabilityPress: function () {
			var that = this;
			var oFormModel = that.getView().getModel("oFormModel");
			var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var visitorData = oFormModel.getProperty("/visitorData");
			var payload = {
				"date": oMeetingData.date,
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"parkingType": visitorData.parkingType

			};
			$.ajax({
				url: "/VMS/rest/parkingSlotController/checkAvailableParkingSlot?vehicleType=" + visitorData.parkingType,
				type: "GET",
				data: {
					"data": JSON.stringify(payload)
				},
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				// dataType: "json",
				success: function (data, status, response) {
					// sap.m.MessageToast.show("Success");
					console.log(data);
					oAdminModel.setProperty("/AvailableParkingSlots", data);
					console.log(status);
					console.log(response);

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

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
			var visitorData = oFormModel.getProperty("/visitorData");
			var eId = oAdminModel.getProperty("/userDetails").eId;
			console.log(visitorData);
			console.log(oMeetingData);
			var visitors = oAdminModel.getProperty("/Visitors");
			visitors.push(visitorData);
			console.log(visitors);
			var payload = {
				"purpose": oMeetingData.purpose,
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"eId": eId,
				"rId": oMeetingData.rId,
				"date": oMeetingData.date,
				"facility": "",
				"capacity": oMeetingData.capacity,
				"visitors": visitors
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

				// dataType: "json",
				success: function (data, status, response) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Successfully Pre-Registered");
						that._oDialog1.close();
						that._oDialog1.destroy();
						that._oDialog1 = null;
					} else if (data.status === 300) {
						sap.m.MessageToast.show("Having a Meeting Clash");
					} else {
						sap.m.MessageToast.show("Something Went Wrong..please try again");
					}
					console.log(status);
					console.log(response);
					oAdminModel.setProperty("/oMeetingData", {});
					oAdminModel.setProperty("/visitorData", {});
					oAdminModel.setProperty("/Visitors", []);
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