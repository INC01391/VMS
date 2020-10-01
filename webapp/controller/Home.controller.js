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
						oLoginModel.setProperty("/loginDetails", data);
						// oAdminModel.setProperty("/userDetails", data);
						that.getRouter().navTo("AdminDetails");
					} else if (response.status === 200 && data.employeeRole === "host") {
						sap.m.MessageToast.show("Successfully Logged IN");
						oLoginModel.setProperty("/loginDetails", data);
						that.getRouter().navTo("HostDetails");
					} else if (response.status === 200 && data.employeeRole === "security") {
						sap.m.MessageToast.show("Successfully Logged IN");
						oLoginModel.setProperty("/loginDetails", data);
						that.getRouter().navTo("SecurityDetails");
					} else {
						MessageBox.warning("Invalid Credentials");
					}

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
		onEditDetails: function () {
			this.bEdit = true;
			Fragment.byId("idCheckinDetails", "idSimpleFormEditable").setVisible(true);
			Fragment.byId("idCheckinDetails", "idSimpleForm").setVisible(false);
		},
		onConfirmDetails: function () {
			var that = this;
			var oFormModel = that.getOwnerComponent().getModel("oFormModel");
			var visitorData = oFormModel.getProperty("/userDetails/data");
			// var image = oFormModel.getProperty("/photo");
			// var res = image.split("base64,");
			// console.log(visitorData);
			// var payload = visitorData;
			// var vhId = that.getView().byId("idVhid").getValue();
			// 			{
			// "firstName":"abc",
			// "lastName":"def",
			// "email":"rohithv63@gmail.com",
			// "contactNo":"7025508696",
			// "organisation":"TCS",
			// "proofType":"aadhar",
			// "proofNo":"asdfghhk123",
			// "mId":69
			// }
			var payload = {

				"firstName": visitorData.visitorFirstName,
				"lastName": visitorData.visitorLastName,
				"email": visitorData.visitorEmail,
				"contactNo": visitorData.visitorPhoneNumber,
				"organisation": visitorData.organization,
				"proofType": visitorData.visitorIdProofType,
				"proofNo": visitorData.visitorIdProofNumber,
				"mId": visitorData.mId
					// "image": res[1]

			};
			// var vhId = 3;
			// var sUrl = "/VMS_Service/visitor/getVisitorDetails?vhId=1";
			console.log(payload);
			$.ajax({
				url: "/VMS/rest/visitorController/editVisitor",
				type: "POST",
				data: JSON.stringify(payload),

				// dataType: "json",
				success: function (data, status, response) {
					console.log(data);
					if (data.status === 200) {
						// sap.m.MessageToast.show("Successfully Pre-Registered");
						MessageBox.success(
							"Welcome to Incture Technologies!!Please Collect Access Card From the Security."
						);
						that.bEdit = false;
					} else if (data.status === 300) {
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
						data:null,
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
		onVisitorRegisterPress: function () {
			this.getRouter().navTo("VisitorDetails");
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		}
	});
});