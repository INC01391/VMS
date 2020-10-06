jQuery.sap.require("sap.ndc.BarcodeScanner");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, BarcodeScanner, MessageBox, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("com.incture.VMS.controller.Home", {
		onInit: function () {
			var oLoginFormData = {
				"username": "",
				"password": ""
			};
			var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
			oLoginModel.setProperty("/oLoginFormData", oLoginFormData);

			var oData = {
				"vhId": "",
				"visitorParkingData": "",
				"newVisitorParkingData": "",
				"oFormData": {
					"parkingType": "",
					"vehicleNo": "",
					"pId": ""
				},
				"AvailableParkingSlots": "",
				"AllParkingSlots": "",
				"sSelectedKey": ""

			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "oParkingModel");
			// var oParkingModel = this.getView().getModel("oParkingModel");
		},
		onLogin: function () {
			var oDialog = new sap.m.BusyDialog();
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 3000);
			var that = this;
			var oSecurityModel = this.getOwnerComponent().getModel("oSecurityModel");
			var oAdminModel = this.getOwnerComponent().getModel("oAdminModel");
			var oHostModel = this.getOwnerComponent().getModel("oHostModel");
			var oLoginModel = that.getView().getModel("oLoginModel");
			var obj = oLoginModel.getProperty("/oLoginFormData");
			var sUrl = "/VMS/rest/employeeController/login?employeeid=" + obj.username + "&password=" + obj.password;
			console.log(sUrl);
			$.ajax({
				url: sUrl,
				type: "POST",
				data: null,
				// headers: {
				// 	"X-CSRF-Token": token
				// },
				dataType: "json",
				success: function (data, status, response) {
					oDialog.close();
					// sap.m.MessageToast.show("Success");
					// oLoginModel.setProperty("/userDetails", data);
					console.log(data);
					console.log(response);
					if (response.status === 200 && data.employeeRole === "admin") {
						sap.m.MessageToast.show("Successfully Logged IN");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						oLoginModel.setProperty("/loginDetails", data);
						// oAdminModel.setProperty("/userDetails", data);
						that.getRouter().navTo("AdminDetails");
					} else if (response.status === 200 && data.employeeRole === "host") {
						sap.m.MessageToast.show("Successfully Logged IN");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						oLoginModel.setProperty("/loginDetails", data);
						that.getRouter().navTo("HostDetails");
					} else if (response.status === 200 && data.employeeRole === "security") {
						sap.m.MessageToast.show("Successfully Logged IN");
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						oLoginModel.setProperty("/loginDetails", data);
						that.getRouter().navTo("SecurityDetails");
					} else {
						MessageBox.warning("Invalid Credentials");
					}
					console.log(oLoginModel);
				},
				error: function (e) {
					MessageBox.information("Server Not Responding");
					oDialog.close();
					console.log(e);
					// that.getRouter().navTo("AdminDetails");
				}
			});
			// if (obj.username === "admin") {
			// 	this.getRouter().navTo("AdminDetails");
			// }
			// if (obj.username === "host") {
			// 	this.getRouter().navTo("HostDetails");
			// }
			// if (obj.username === "security") {
			// 	this.getRouter().navTo("SecurityDetails");
			// }
		},
		onParkingCheckInPress: function () {
			this.getView().byId("idParking").setVisible(false);
			this.getView().byId("idRegister").setVisible(true);
		},
		onParkingCheckOutPress: function () {
			this.getView().byId("idParking").setVisible(false);
			this.getView().byId("idCheckOut").setVisible(true);
		},
		/*onAdminPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("AdminDetails");
		},
		onSecurityPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("SecurityDetails");
		},
		onHostPress: function (oEvent) {
			// MessageToast.show("Host is Pressed");
			this.getRouter().navTo("HostDetails");
		},*/
		onScanCodeCheckIn: function () {
			var that = this;
			var oFormModel = that.getOwnerComponent().getModel("oFormModel");
			var vhId;
			sap.ndc.BarcodeScanner.scan(
				function (oResult) {
					console.log(oResult);
					vhId = oResult.text;
					console.log(vhId);
					var sUrl = "/VMS/rest/visitorController/getVisitorById?id=" + vhId;
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
							console.log(data);
							oFormModel.setProperty("/userDetails", data);
						},
						type: "GET"
					});
					if (oResult.cancelled === false) {
						that.fnOpenDialog();
					}
					// / * process scan result * /
				},
				function (oError) {
					MessageBox.warning("Error");
					// / * handle scan error * /
				},
				function (oResult) {
					// / * handle input dialog change * /
				});
		},
		fnOpenDialog: function () {
			if (!this._oDialog) {
				//this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("idCheckinDetails", "com.incture.VMS.fragment.visitorCheckinDetails", this); // Instantiating the Fragment
			}
			this.getView().addDependent(this._oDialog); // Adding the fragment to your current view
			this._oDialog.open();
		},
		onCapture: function () {
			var that = this;
			navigator.camera.getPicture(function (imageData) {
				console.log(imageData);
				var oFormModel = that.getView().getModel("oFormModel");
				var res = imageData.split("base64,");
				var image = res[1];
				if (that.bEdit === true) {
					Fragment.byId("idCheckinDetails", "idPhoto").setVisible(true);
					oFormModel.setProperty("/photo", image);
				}
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
		onEditDetails: function () {
			this.bEdit = true;
			Fragment.byId("idCheckinDetails", "idSimpleFormEditable").setVisible(true);
			Fragment.byId("idCheckinDetails", "idSimpleForm").setVisible(false);
		},
		onConfirmDetails: function () {
			var that = this;
			var oFormModel = that.getOwnerComponent().getModel("oFormModel");
			var visitorData = oFormModel.getProperty("/userDetails/data");
			// var vhId = visitorData.visitorId;
			var vhId = 5;
			var image = oFormModel.getProperty("/photo");

			// console.log(visitorData);
			// var payload = visitorData;
			// var vhId = that.getView().byId("idVhid").getValue();
			// var payload = {
			// 	"visitorFirstName": "priya",
			// 	"visitorLastName": "prasad",
			// 	"visitorAddress": "abc",
			// 	"visitorEmail": "priyaganga98@gmail.com",
			// 	"visitorPhoneNumber": "+917025545433",
			// 	"photo": "ty123ycb",
			// 	"organization": "tcs",
			// 	"visitorIdProofType": "aadhar",
			// 	"visitorIdProofNumber": "7894568",
			// 	"purpose": "interview"
			// };
			var payload = {

				"visitorFirstName": visitorData.visitorFirstName,
				"visitorLastName": visitorData.visitorLastName,
				"visitorAddress": "abc",
				"visitorEmail": visitorData.visitorEmail,
				"visitorPhoneNumber": visitorData.visitorPhoneNumber,
				"photo": image,
				"organization": visitorData.organization,
				"visitorIdProofType": visitorData.visitorIdProofType,
				"visitorIdProofNumber": visitorData.visitorIdProofNumber,
				"purpose": "interview"

			};
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/visitorController/updateVisitorById?id=" + vhId,
				type: "POST",
				data: JSON.stringify(payload),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					console.log(data);
					if (response.status === 200) {
						// sap.m.MessageToast.show("Successfully Pre-Registered");
						that.fnCheckIn(vhId);
						// MessageBox.success(
						// 	"Welcome to Incture Technologies!!Please Collect Access Card From the Security."
						// );
						that.bEdit = false;
					} else if (response.status === 300) {
						sap.m.MessageToast.show("Having a Meeting Clash");
					} else {
						sap.m.MessageToast.show("Something Went Wrong");
					}

					console.log(status);
					console.log(response);

					// that._oDialog1.close();
					// that._oDialog1.destroy();
					// that._oDialog1 = null;
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
			that._oDialog.close();
			that._oDialog.destroy();
			that._oDialog = null;
		},
		fnCheckIn: function (vhId) {
			$.ajax({
				url: "/VMS/rest/visitorController/updateCheckIn?id=" + vhId,
				type: "POST",
				data: null,

				// dataType: "json",
				success: function (data, status, response) {
					console.log(data);
					if (data.status === 200) {

						MessageBox.success(
							"Welcome to Incture Technologies!!Please Collect Access Card From the Security."
						);

					} else {
						sap.m.MessageToast.show("Something Went Wrong");
					}

					console.log(status);
					console.log(response);

					// that._oDialog1.close();
					// that._oDialog1.destroy();
					// that._oDialog1 = null;
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
		},
		onScanCodeCheckOut: function () {
			var that = this;
			// var oVisitorModel = that.getView().getModel("oVisitorModel");
			var vhId;
			sap.ndc.BarcodeScanner.scan(
				function (oResult) {
					console.log(oResult);
					vhId = oResult.text;

					$.ajax({
						url: "/VMS/rest/visitorController/updateCheckOut?id=" + vhId,
						type: "POST",
						data: null,
						dataType: "json",
						success: function (data, status, response) {
							console.log(data);
							if (data.status === 200) {

								MessageBox.success("Thank You For Visiting!!Please HandOver the Access Card to the Security.");

							} else if (data.status === 300) {
								MessageBox.information("Already Checked out");
							} else {
								sap.m.MessageToast.show("Something Went Wrong");
							}

						},
						error: function (e) {
							sap.m.MessageToast.show("fail");

						}
					});

				},
				function (oError) {

					// / * handle scan error * /
				}

			);

		},
		onScanQRCode: function () {
			var that = this;
			var oParkingModel = this.getView().getModel("oParkingModel");
			var vhId, sUrl;
			sap.ndc.BarcodeScanner.scan(
				function (oResult) {
					// console.log(oResult);
					vhId = oResult.text;
					// oParkingModel.setProperty("/vhId", vhId);
					console.log(vhId);
					if (oResult.cancelled === false) {
						sUrl = "/VMS/rest/parkingSlotController/slotfromqr?vid=" + vhId;
						$.ajax({
							url: sUrl,
							type: "GET",
							data: null,

							// dataType: "json",
							success: function (data, status, response) {
								// sap.m.MessageToast.show("Success");
								console.log(data);

								oParkingModel.setProperty("/visitorParkingData", data);
								// console.log(status);
								// console.log(response);

								// that.fnGetData();

							},
							error: function (e) {
								sap.m.MessageToast.show("fail");

							}
						});

						that.getView().byId("idQRCode").setVisible(true);
						// that.getView().byId("idParkingSignIn").setVisible(false);
						that.getView().byId("idRegister").setVisible(false);
					}
					// alert("We got a bar code\n" +
					// 	"Result: " + oResult.text + "\n" +
					// 	"Format: " + oResult.format + "\n" +
					// 	"Cancelled: " + oResult.cancelled);
					// / * process scan result * /
				},
				function (oError) {
					// alert(oError);
					// / * handle scan error * /
				},
				function (oResult) {
					// / * handle input dialog change * /
				}
			);
		},
		onParkingAvailabilityPress: function () {
			var oParkingModel = this.getView().getModel("oParkingModel");
			var oFormData = oParkingModel.getProperty("/oFormData");
			var parkingType = oFormData.parkingType;
			var sUrl = "/VMS/rest/parkingSlotController/checkAvailableParkingSlot?vehicleType=" + parkingType;
			$.ajax({
				url: sUrl,
				type: "GET",
				data: null,

				// dataType: "json",
				success: function (data, status, response) {
					sap.m.MessageToast.show("Success");
					console.log(data);
					oParkingModel.setProperty("/AvailableParkingSlots", data);
					console.log(status);
					console.log(response);

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
			this.getView().byId("idParkingAvailability").setVisible(true);
		},
		onLoginSubmitPress: function () {
			var that = this;
			var oParkingModel = this.getView().getModel("oParkingModel");
			var pId = oParkingModel.getProperty("/visitorParkingData/data/0").parkingSlotId;
			var vehicleNumber = this.getView().byId("idVehicleNumber").getValue();
			console.log(pId);
			console.log(vehicleNumber);
			$.ajax({
				url: "/VMS_Service/rest/parkingSlotController/allotslot?parkingid=" + pId + "&vehiclenumber=" + vehicleNumber,
				type: "POST",
				data: null,
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (response.status === 200) {
						oParkingModel.setProperty("/visitorParkingData", {});

						MessageBox.success("Please Go ahead and Park Your Vehicle");
						// var sUrl = "/VMS_Service/visitor/getAllParking";
						// that.fnGetData(sUrl, "/AllParkingSlots");

					} else {
						sap.m.MessageToast.show("Something Went Wrong");
					}

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
			this.getView().byId("idQRCode").setVisible(false);
			this.getView().byId("idParking").setVisible(true);
		},

		onRegisterSubmitPress: function () {
			var that = this;
			var oParkingModel = this.getView().getModel("oParkingModel");
			var oFormData = oParkingModel.getProperty("/oFormData");
			// var vehicleNumber = this.getView().byId("idVehicleNumber").getValue();
			console.log(oFormData);
			// console.log(vehicleNumber);
			$.ajax({
				url: "/VMS_Service/rest/parkingSlotController/allotslot?parkingid=" + oFormData.pId + "&vehiclenumber=" + oFormData.vehicleNo,
				type: "POST",
				data: null,
				// headers: {
				// 	"X-CSRF-Token": token
				// },

				dataType: "json",
				// contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {
					if (response.status === 200) {
						oParkingModel.setProperty("/oFormData", {});

						MessageBox.success("Please Go ahead and Park Your Vehicle");
						that.getView().byId("idParking").setVisible(true);
						that.getView().byId("idRegister").setVisible(false);
						// var sUrl = "/VMS_Service/visitor/getAllParking";
						// that.fnGetData(sUrl, "/AllParkingSlots");

					} else {
						MessageBox.warning("Please Select Parking Slot by checking the Availability");
					}

					// that.fnGetData();

				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});
			this.getView().byId("idParkingAvailability").setVisible(false);
		},
		onCheckOut: function () {
			var that = this;
			var oParkingModel = this.getView().getModel("oParkingModel");
			// var pId = oParkingModel.getProperty("/sSelectedKey");
			var pId = 5;
			$.ajax({
				url: "/VMS/rest/parkingSlotController/freeslot?parkingid=" + pId,
				type: "POST",
				data: null,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				success: function (data, status, response) {

					MessageBox.success("Thank You For Visiting!!Visit Again!!");
					oParkingModel.setProperty("/sSelectedKey", "");
					console.log(data);
					// var sUrl = "/VMS_Service/visitor/getAllParking";
					// that.fnGetData(sUrl, "/AllParkingSlots");

					// that.fnGetData();
				},
				error: function (e) {
					sap.m.MessageToast.show("fail");

				}
			});

		},
		onVisitorRegisterPress: function () {
			this.getRouter().navTo("VisitorDetails");
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		}
	});
});