sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox"
], function (Controller, UIComponent, MessageBox) {
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
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": "",
				"organisation": "",
				"proofType": "",
				"proofNo": "",
				"locality": "",
				"photo": ""
			};
			oVisitorModel.setProperty("/visitorData", visitorData);
			var addvisitorData = {
				"firstName": "",
				"lastName": "",
				"email": "",
				"contactNo": "",
				"organisation": "",
				"proofType": "",
				"proofNo": "",
				"locality": ""
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

		onCapture: function () {
			var that = this;
			navigator.camera.getPicture(function (imageData) {
				console.log(imageData);
				var oVisitorModel = that.getView().getModel("oVisitorModel");
				var res = imageData.split("base64,");
				var image = res[1];
				oVisitorModel.setProperty("/visitorData/photo", image);
                that.getView().byId("idPhoto").setVisible(true);
                console.log(image);
				// else {
				// 	oVisitorModel.setProperty("/visitorData/photo", image);
				// 	that.getView().byId("idImage").setVisible(true);
				// }

			}, that.onFail, {
				quality: 75,
				targetWidth: 300,
				targetHeight: 300,
				sourceType: navigator.camera.PictureSourceType.CAMERA,
				destinationType: navigator.camera.DestinationType.FILE_URI
			});
		},
		// onSuccess: function (imageData) {
		// 	console.log(imageData);
		// 	Fragment.byId("idCheckinDetails", "idPhoto").setVisible(true);
		// 	var oVisitorModel = this.getView().getModel("oVisitorModel");
		// 	oVisitorModel.setProperty("/photo", imageData);

		// },
		onFail: function (message) {
			alert("Failed because: " + message);
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
		
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMM dd, yyyy"
			});
			var date = new Date();
			var newdate = oDateFormat.format(date);
			// oAdminModel.setProperty("/Visitors", visitors);
			// var Visitors = oAdminModel.getProperty("/Visitors");
			console.log(visitors);
			// var payload = {
			// 		"purpose": "interview",
			// 		"comments": "developer",
			// 		"beginTime": "16:30:00",
			// 		"endTime": "17:00:00",
			// 		"eId": 4,
			// 		"date": "oct 6, 2020",
			// 		"visitors": [{
			// 			"firstName": "abc",
			// 			"lastName": "def",
			// 			"email": "rohithv@gmail.com",
			// 			"contactNo": "702550896",
			// 			"organisation": "TCS",
			// 			"proofType": "aadhar",
			// 			"proofNo": "asdfghhkfghf",
			// 			"locality": "kerala",
			// 			"photo": "hsjkalagnak"
			// 		}]
			// 	}
				var payload = {
					"purpose": oMeetingData.purpose,
					"comments": "developer",
					"beginTime": oMeetingData.beginTime,
					"endTime": oMeetingData.endTime,
					"eId": oMeetingData.eId,
					"date": newdate,
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
						// 	"locality": "Assam",
				        //  "photo":photo
						// }]
				};
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/visitorController/onSpot",
				type: "POST",
				data: JSON.stringify(payload),

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (response.status === 200) {
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