

let baseUrl = "http://localhost:8080/spring_pos/";

loadAllCustomers();

/**
 * Save Customer Button
 **/
$("#btnSaveCustomer").click(function () {
    let formData = $("#customerForm").serialize();
    $.ajax({
        url: baseUrl + "customer",
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (resp) {
            successAlert("Customer", resp.message);
            loadAllCustomers();
        },
        error: function (error) {
            errorAlert("Customer", JSON.parse(error.responseText).message);
        }
    });
});

/**
 * Update Customer Button
 **/
$("#btnUpdateCustomer").click(function () {
    let cusId = $("#txtCusId").val();
    let cusName = $("#txtCusName").val();
    let cusAddress = $("#txtCusAddress").val();
    let cusSalary = $("#txtCusSalary").val();

    let customerObj = {
        id: cusId,
        name: cusName,
        address: cusAddress,
        salary: cusSalary
    };

    $.ajax({
        url: baseUrl + "customer",
        method: "PUT",
        contentType: "application/json",        // Specify content type of the request body
        data: JSON.stringify(customerObj),      // This is the actual request
        dataType: 'json',                       // Specify server is expecting json data
        success: function (resp) {
            successAlert("Customer", resp.message);
            loadAllCustomers();
        },
        error: function (error) {
            errorAlert("Customer", JSON.parse(error.responseText).message);
        }
    });
});

/**
 * Delete Customer Button
 **/
$("#btnDeleteCustomer").click(function () {
    let cusId = $("#txtCusId").val();
    let cusName = $("#txtCusName").val();
    let cusAddress = $("#txtCusAddress").val();
    let cusSalary = $("#txtCusSalary").val();

    const customerObj = {
        id: cusId,
        name: cusName,
        address: cusAddress,
        salary: cusSalary
    };

    $.ajax({
        url: baseUrl + "customer",
        method: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(customerObj),
        dataType: 'json',
        success: function (resp) {
            successAlert("Customer", resp.message);
            loadAllCustomers();
        },
        error: function (error) {
            errorAlert("Customer", JSON.parse(error.responseText).message);
        }
    });
});

/**
 * Search Customer Button
 **/
$("#btnSearchCustomer").click(function () {
    searchCustomer();
});
$("#txtSearchCusId").on("keypress", function (event) {
    if (event.which === 13) {
        searchCustomer();
    }
});

/**
 * Search Customer Method
 **/
function searchCustomer() {
    let searchCusId = $("#txtSearchCusId").val();
    $.ajax({
        url: baseUrl + "customer/searchCusId?id=" + searchCusId,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (resp) {
            $("#customerTable").empty();
            let row = "<tr><td>" + resp.id + "</td><td>" + resp.name + "</td><td>" + resp.address + "</td><td>" + resp.salary + "</td></tr>";
            $("#customerTable").append(row);
            clearInputFields();
            tableListener();
        },
        error: function (error) {
            emptyMessage(JSON.parse(error.responseText).message);
            loadAllCustomers();
        }
    })
}

/**
 * Get All Customers Button
 **/
$('#btnGetAllCustomers').click(function () {
    loadAllCustomers();
});

/**
 * Load All Customers Method
 **/
function loadAllCustomers() {
    $.ajax({
        url: baseUrl + "customer/loadAllCustomer",
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (resp) {
            $("#customerTable").empty();

            for (let i of resp.data) {
                let id = i.id;
                let name = i.name;
                let address = i.address;
                let salary = i.salary;

                let row = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + address + "</td><td>" + salary + "</td></tr>";
                $("#customerTable").append(row);
            }
            clearInputFields();
            checkValidity(customerValidations);
            tableListener();
            generateCustomerId();
        },
        error: function (error) {
            console.log("Load All Customers Error : " + error);
        }
    });
}

/**
 * Generate CustomerId Method
 **/
function generateCustomerId() {
    $("#txtCusId").val("C00-001");
    $.ajax({
        url: baseUrl + "customer/CustomerIdGenerate",
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (resp) {
            let id = resp.value;
            let tempId = parseInt(id.split("-")[1]);
            tempId = tempId + 1;
            if (tempId <= 9) {
                $("#txtCusId").val("C00-00" + tempId);
            } else if (tempId <= 99) {
                $("#txtCusId").val("C00-0" + tempId);
            } else {
                $("#txtCusId").val("C00-" + tempId);
            }
        },
        error: function (error) {
            console.log("Generate Customer Id Error : ", error);
        }
    });
}

/**
 * Table Listener Method
 **/
function tableListener() {
    $("#customerTable>tr").on("click", function () {
        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let address = $(this).children().eq(2).text();
        let salary = $(this).children().eq(3).text();

        $("#txtCusId").val(id);
        $("#txtCusName").val(name);
        $("#txtCusAddress").val(address);
        $("#txtCusSalary").val(salary);

        $("#btnSaveCustomer").attr('disabled', true);
        $("#btnUpdateCustomer").attr('disabled', false);
        $("#btnDeleteCustomer").attr('disabled', false);
    });
}

/**
 * Clear All Customers Button
 **/
$("#btnClearAllCustomer").click(function () {
    loadAllCustomers();
});

/**
 * Clear Input Fields
 **/
function clearInputFields() {
    $("#txtCusName").focus();
    $('#txtCusName').val("");
    $('#txtCusAddress').val("");
    $('#txtCusSalary').val("");
    $('#txtSearchCusId').val("");

    $("#btnSaveCustomer").attr('disabled', true);
    $("#btnUpdateCustomer").attr('disabled', true);
    $("#btnDeleteCustomer").attr('disabled', true);
}

/**
 * Customer Validations
 **/
const regExCusId = /^(C00-)[0-9]{3}$/;
const regExCusName = /^[A-z ]{3,20}$/;
const regExCusAddress = /^[A-Za-z0-9/, -]{4,30}$/;
const regExCusSalary = /^[0-9]{1,}[.]?[0-9]{2}$/;

let customerValidations = [];
customerValidations.push({
    reg: regExCusId,
    field: $('#txtCusId'),
    error: 'Customer id must match the pattern C00-001'
});
customerValidations.push({
    reg: regExCusName,
    field: $('#txtCusName'),
    error: 'Customer name must be between 3-20 characters'
});
customerValidations.push({
    reg: regExCusAddress,
    field: $('#txtCusAddress'),
    error: 'Customer address must be between 4-30 characters'
});
customerValidations.push({
    reg: regExCusSalary,
    field: $('#txtCusSalary'),
    error: 'Customer salary  must have 3 digits with 2 decimal places'
});

/**
 * Check Customer Validations
 **/
$("#txtCusId,#txtCusName,#txtCusAddress,#txtCusSalary").on('keyup', function (event) {
    checkValidity(customerValidations);
});

/**
 * Disable TAB-KEY
 **/
$("#txtCusId,#txtCusName,#txtCusAddress,#txtCusSalary").on('keydown', function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
    }
});

/**
 * Enable ENTER-KEY
 **/
$("#txtCusId").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusId, $("#txtCusId"))) {
        $("#txtCusName").focus();
    }
});
$("#txtCusName").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusName, $("#txtCusName"))) {
        $("#txtCusAddress").focus();
    }
});
$("#txtCusAddress").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusAddress, $("#txtCusAddress"))) {
        $("#txtCusSalary").focus();
    }
});
$("#txtCusSalary").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusSalary, $("#txtCusSalary"))) {
        $("#btnSaveCustomer").focus();
    }
});

/**
 * Disable/Enable Buttons
 **/
function setButtonState(value) {
    if (value > 0) {
        $("#btnSaveCustomer").attr('disabled', true);
        $("#btnUpdateCustomer").attr('disabled', true);
        $("#btnDeleteCustomer").attr('disabled', true);
    } else {
        $("#btnSaveCustomer").attr('disabled', false);
        $("#btnUpdateCustomer").attr('disabled', false);
        $("#btnDeleteCustomer").attr('disabled', false);
    }
}