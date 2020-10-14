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
			var oFormModel = this.getOwnerComponent().getModel("oFormModel");
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
			var sUrl4 = "/VMS/rest/visitorController/getExpectedVisitorsforhost?eid=" + eId + "&date=" + newdate;
			this.fnGetData(sUrl4, "/ExpectedVisitorDetails");
			var sUrl5 = "/VMS/rest/blackListController/selectAllBlackListByEmployee?eid=2";
			this.fnGetData(sUrl5, "/BlackListed");
			console.log(oHostModel);
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
					// "firstName": "",
					// "lastName": "",
					// "email": "",
					// "contactNo": " ",
					// "proofType": "",
					// "proofNo": "",
					// "locality": "",
					// "organization": "",
					// "parkingType": "",
					// "pId": ""
			};
			oFormModel.setProperty("/oFormData", oFormData);
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
			var visitors = [];
			oFormModel.setProperty("/Visitors", visitors);

			var sUrl8 = "wss://projectvmsp2002476966trial.hanatrial.ondemand.com/vms/chat/" + eId;
			var that = this;
			// var sUrl1 = "/VMS_Service/chat/1";
			var webSocket = new WebSocket(sUrl8);
			webSocket.onerror = function (event) {
				// alert(event.data);

			};
			webSocket.onopen = function (event) {
				// alert(event.data);

			};
			webSocket.onmessage = function (event) {
				var jsonData = event.data;
				var msg = JSON.parse(jsonData);
				if (msg.content !== "Connected!") {
					var count1 = oHostModel.getProperty("/Notificationcount");
					var count2 = parseInt(count1, 10);
					count2 = count2 + 1;
					var countupdated = count2.toString();
					oHostModel.setProperty("/Notificationcount", countupdated);
					MessageBox.information(msg.content);
					that.fnGetData(sUrl1, "/Details");
					that.fnGetData(sUrl2, "/CheckInDetails");
				}
				// var count1 = oHostModel.getProperty("/Notificationcount");
				// count = count + 1;
				// var countupdated = count.toString();
				// oHostModel.setProperty("/Notificationcount", countupdated);
				// alert(event.data);

			};
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
		onNotificationPress: function (oEvent) {
			var oHostModel = this.getView().getModel("oHostModel");
			var eId = 7;
			var sUrl = "/VMS/rest/visitorController/getAllNotifications?eId=" + eId;
			this.fnGetData(sUrl, "/notificationList");
			console.log(oHostModel);
			if (!this._oPopover1) {
				this._oPopover1 = sap.ui.xmlfragment("idNotifications", "com.incture.VMS.fragment.notification", this);
				this.getView().addDependent(this._oPopover1);
			}
			this._oPopover1.openBy(oEvent.getSource());
			var count = oHostModel.getProperty("/Notificationcount/data");
			count = "0";
			oHostModel.setProperty("/Notificationcount", count);
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
		onUserPress: function (oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("idUser", "com.incture.VMS.fragment.user", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
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
		onAddToBlackListPress: function (oEvent) {
			var that = this;
			var oHostModel = that.getView().getModel("oHostModel");
			var oSource = oEvent.getSource();
			oHostModel.setProperty("/BlackListedSource", oSource);
			var spath = oEvent.getSource().getParent().getBindingContextPath();
			oHostModel.setProperty("/BlackListedPath", spath);
			if (!that._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				that._oDialog = sap.ui.xmlfragment("idaddBlackListVisitorFrag", "com.incture.VMS.fragment.addBlackListVisitor",
					this); // Instantiating the Fragment
			}
			that.getView().addDependent(that._oDialog); // Adding the fragment to your current view
			that._oDialog.open();
		},
		onConfirmBlackList: function () {
			var that = this;
			var oHostModel = that.getView().getModel("oHostModel");
			var date = oHostModel.getProperty("/date");
			// var eId = oHostModel.getProperty("/userDetails").eId;
			var eId = 4;
			var eid = 2;
			var sUrl1 = "/VMS/rest/visitorController/getVisitorHistory?eid=" + eId + "&Date=" + date;
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=" + eId + "&Date=" + date;
			var sUrl3 = "/VMS/rest/blackListController/selectAllBlackListByEmployee?eid=2";
			// var oSource = oHostModel.getProperty("/BlackListedSource");
			var spath = oHostModel.getProperty("/BlackListedPath");
			var obj = oHostModel.getProperty(spath);
			// console.log(obj);
			var sRemarks = Fragment.byId("idaddBlackListVisitorFrag", "idTarea").getValue();
			var payload = {
				"meetingId": obj.mid,
				"visitorId": obj.visitorId,
				"employeeId": eid,
				"reason": sRemarks
			};
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/blackListController/addBlackList",
				type: "POST",
				data: JSON.stringify(payload),
				headers: {
					// "X-CSRF-Token": token
					"content-type": "application/json"
				},

				dataType: "json",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully BlackListed");
					console.log(response);
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					that.fnGetData(sUrl3, "/BlackListed");
					that.fnGetData(sUrl2, "/CheckOutDetails");
					that.fnGetData(sUrl1, "/Details");
					var oDialog = new sap.m.BusyDialog();
					oDialog.open();
					setTimeout(function () {
						oDialog.close();
					}, 3000);
					// oSource.setEnabled(false);
					// if (data.status === 300) {
					// 	MessageBox.warning("Already Blaacklisted");
					// }
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		onPressUnblock: function (oEvent) {
			var that = this;
			var oHostModel = that.getOwnerComponent().getModel("oHostModel");
			// var eId = oHostModel.getProperty("/userDetails").eId;
			var eId = 4;
			var date = oHostModel.getProperty("/date");
			var sUrl1 = "/VMS/rest/visitorController/getVisitorHistory?eid=" + eId + "&Date=" + date;
			var sUrl2 = "/VMS/rest/visitorController/getVisitorCheckOut?eid=" + eId + "&Date=" + date;
			var sUrl3 = "/VMS/rest/blackListController/selectAllBlackListByEmployee?eid=2";
			var oSource = oEvent.getSource();
			var spath = oSource.getParent().getBindingContextPath();
			var obj = oHostModel.getProperty(spath);
			console.log(obj);
			var bId = obj.bId;
			$.ajax({
				url: "/VMS/rest/blackListController/removeFromBlackList?id=" + bId,
				type: "POST",
				data: null,
				dataType: "json",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Successfully Unblocked");
					var oDialog = new sap.m.BusyDialog();
					oDialog.open();
					setTimeout(function () {
						oDialog.close();
					}, 3000);
					that.fnGetData(sUrl3, "/BlackListed");
					that.fnGetData(sUrl2, "/CheckOutDetails");
					that.fnGetData(sUrl1, "/Details");
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

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
		onSelectChange: function () {
			console.log(oFormModel);
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
			// var checked1 = Fragment.byId("idPreRegistrationFrag", "idwifi").getSelected();
			// var checked2 = Fragment.byId("idPreRegistrationFrag", "idconference").getSelected();
			// var checked3 = Fragment.byId("idPreRegistrationFrag", "idboard").getSelected();
			// var afacilities = [];
			// if (checked1 === true) {
			// 	afacilities.push("wifi");
			// }
			// if (checked2 === true) {
			// 	afacilities.push("conferencecalling");
			// }
			// if (checked3 === true) {
			// 	afacilities.push("board");
			// }
			// console.log(afacilities);
			// var facilities = afacilities.toString();
			// oHostModel.setProperty("/facilities", facilities);
			// console.log(facilities);
			var sUrl = "/VMS/rest/meetingRoomController/checkMeetingRoomAvailability?begin=" + date + " " + beginTime + "&end=" + date + " " +
				endTime + "&capacity=" + capacity;
			console.log(sUrl);
			$.ajax({
				// url:"rest/meetingRoomController/checkMeetingRoomAvailability?begin=30-9-2020 13:30:00&end=30-9-2020 14:30:00&capacity=10",
				url: "/VMS/rest/meetingRoomController/checkMeetingRoomAvailability?begin=" + date + " " + beginTime + "&end=" + date + " " +
					endTime + "&capacity=" + capacity,
				type: "GET",
				data: null,

				// headers: {
				// 	"X-CSRF-Token": token
				// },
				//meetingRoomCapacity: 25
				// meetingRoomId: 2
				// meetingRoomName: "room1"
				// meetingRoomStatus: 1

				dataType: "json",
				success: function (data, status, response) {
					console.log(response);
					if (response.status === 200) {
						// sap.m.MessageToast.show("Success");
						// console.log(data);
						oFormModel.setProperty("/AvailableRooms", data);

					} else {
						sap.m.MessageToast.show("Please enter values in the right format");
					}
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
			// var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var oFormData = oFormModel.getProperty("/oFormData");
			var parkingType = oFormData.parkingType;
			// var payload = {
			// 	"date": oMeetingData.date,
			// 	"beginTime": oMeetingData.beginTime,
			// 	"endTime": oMeetingData.endTime,
			// 	"parkingType": visitorData.parkingType

			// };
			// console.log(payload);
			$.ajax({
				url: "/VMS/rest/parkingSlotController/checkAvailableParkingSlot?vehicleType=Two Wheeler",
				type: "GET",
				data: null,

				// headers: {
				// 	"X-CSRF-Token": token
				// },

				// dataType: "json",
				success: function (data, status, response) {
					// sap.m.MessageToast.show("Success");
					console.log(data);
					oFormModel.setProperty("/AvailableParkingSlots", data);
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
			var oHostModel = that.getView().getModel("oHostModel");
			var oFormModel = this.getOwnerComponent().getModel("oFormModel");
			// var eId = oHostModel.getProperty("/userDetails").eId;
			var eId = 4;
			var oMeetingData = oFormModel.getProperty("/oMeetingData");
			var oFormData = oFormModel.getProperty("/oFormData");
			// var facilities = oHostModel.getProperty("/facilities");
			// console.log(visitorData);
			// console.log(oMeetingData);
			var visitors = oFormModel.getProperty("/Visitors");
			visitors.push(oFormData);
			oFormModel.setProperty("/Visitors", visitors);
			console.log(visitors);
			// 			 {
			//     "purpose": "interview",
			//     "comments": "developer",
			//     "beginTime": "14:30:00",
			//     "endTime":"15:00:00",
			//     "eId":4,
			//     "rId":1,
			//     "date":"sep 29, 2020",
			//     "visitors":
			//         [
			//             {
			//                 "firstName":"abc",
			//                 "lastName":"def",
			//                 "email":"rohithv63@gmail.com",
			//                 "contactNo":"7025508696",
			//                 "organisation":"TCS",
			//                 "proofType":"aadhar",
			//                 "proofNo":"asdfghhk",
			//                 "locality":"kerala",
			//                 "pId":1
			//             }
			//         ]
			// }
			var payload = {
				"purpose": oMeetingData.purpose,
				"comments": "developer",
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"eId": eId,
				"rId": oMeetingData.rId,
				"date": oMeetingData.date,
				// "facility": facilities,
				// "capacity": oMeetingData.capacity,
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
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Successfully Pre-Registered");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						// oHostModel.setProperty("/oMeetingData", {});
						// oHostModel.setProperty("/visitorData", {});
						// oHostModel.setProperty("/Visitors", []);
					} else if (data.status === 300) {
						MessageBox.warning("Having a Meeting Clash");
					} else {
						MessageBox.warning("something went wrong..please try again");
					}
					console.log(status);
					console.log(response);
					oFormModel.setProperty("/oMeetingData", {});
					oFormModel.setProperty("/oFormData", {});
					oFormModel.setProperty("/Visitors", []);
					// var date = oHostModel.getProperty("/date");
					// var sUrl1 = "/VMS_Service/employee/getUpcomingMeetings?eId=" + eId + "&date=" + date;
					// that.fnGetData(sUrl1, "/UpcomingMeetings");
					var sUrl = "/VMS/rest/visitorController/getPreregistredVisitors?eid=" + eId;
					that.fnGetData(sUrl, "/PreRegistration");

				},
				error: function (e) {
					MessageBox.warning("Registration failed");

				}
			});

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