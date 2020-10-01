sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Visitor", {

		onInit: function () {
			var oMeetingData = {
				"eId": "",
				"hostName": "",
				"purpose": "",
				"beginTime": "",
				"endTime": ""
					// "capacity": "",
					// "rId": ""
					// "facility": "wifi,board"
			};
			var oVisitorModel = this.getOwnerComponent().getModel("oVisitorModel");
			oVisitorModel.setProperty("/oMeetingData", oMeetingData);
			var visitorData = {
				// "vhId": "",
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": " ",
				"proofType": "",
				"proofNo": "",
				"locality": "",
				"organisation": "",
				"photo": ""
					// "parkingType": "",
					// "pId": ""
			};
			oVisitorModel.setProperty("/visitorData", visitorData);
			var addvisitorData = {
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": " ",
				"proofType": "",
				"proofNo": "",
				"locality": "",
				"organisation": "",
				"photo": ""
					// "parkingType": "",
					// "pId": ""
			};
			oVisitorModel.setProperty("/addvisitorData", addvisitorData);
			var visitors = [];
			oVisitorModel.setProperty("/Visitors", visitors);
			var sUrl = "/VMS/rest/employeeController/listAllEmployee";
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					// sap.m.MessageToast.show("Data Successfully Loaded");

					oVisitorModel.setProperty("/getEmployeeList", data);
					console.log(oVisitorModel);

				},
				type: "GET"
			});
		},
		onImagePress: function () {

			this.getRouter().navTo("RouteHome");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onRegister: function () {
			var that = this;
			var oVisitorModel = that.getView().getModel("oVisitorModel");
			var oMeetingData = oVisitorModel.getProperty("/oMeetingData");
			var visitorData = oVisitorModel.getProperty("/visitorData");
			console.log(visitorData);
			console.log(oMeetingData);
			var visitors = oVisitorModel.getProperty("/Visitors");
			visitors.push(visitorData);
			// oAdminModel.setProperty("/Visitors", visitors);
			// var Visitors = oAdminModel.getProperty("/Visitors");
			console.log(visitors);
			var payload = {
				"purpose": oMeetingData.purpose,
				"beginTime": oMeetingData.beginTime,
				"endTime": oMeetingData.endTime,
				"eId": oMeetingData.eId,
				"visitors": visitors
					// [{
					// 	"firstName": "Ishita",
					// 	"lastName": "Iyer",
					// 	"email": "ishita@gmail.com",
					// 	"contactNo": "+91 9432178675",
					// 	"organisation": "TCS",
					// 	"proofType": "AADHAAR",
					// 	"proofNo": "78456925756",
					// 	"typeId": "1",
					// 	"locality": "Assam"
					// }]
			};
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/visitorController/onSpot",
				type: "POST",
				data: {
					"data": JSON.stringify(payload)
				},
				// dataType: "json",
				success: function (data, status, response) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Successfully Pre-Registered");
						MessageBox.success(
							"Registration Succesfull...Your Host Will be Informed About Your Arrival, Please Wait in the Lobby and Please Check your Mail for Any Upadtes about the Meeting"
						);
					} else if (data.status === 300) {
						sap.m.MessageToast.show("Having a Meeting Clash");
					} else if (data.status === 301) {
						MessageBox.information("End time can't be less than Begin time");
					} else {
						sap.m.MessageToast.show("Something Went Wrong");
					}
					console.log(status);
					console.log(response);
					oVisitorModel.setProperty("/oMeetingData", {});
					oVisitorModel.setProperty("/visitorData", {});
					oVisitorModel.setProperty("/Visitors", []);
					// that._oDialog1.close();
					// that._oDialog1.destroy();
					// that._oDialog1 = null;
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});

		}

	});

});