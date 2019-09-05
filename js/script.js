let product2 = [
  {
    name: "Product1",
    quantity: 6,
    price: 12123343.25
  },
  {
    name: "Product2",
    quantity: 14,
    price: 2000
  },
  {
    name: "Product3",
    quantity: 13,
    price: 30050
  },
  {
    name: "Product4",
    quantity: 3,
    price: 1000
  }
];

let qtyasc = false;
let priceasc = false;
let update = false;
let index = undefined;
let index_item = undefined;
let error = false;

$(document).ready(function() {
  RenderList(product2);
  //Filter keywords
  $("button.btn-light").click(function() {
    filters = [];
    let search_word = $(".form-control").val();
    apply_filter(".table tbody", 1, search_word);
  });

  //Add new top clear inputs
  $('button:contains("Add new")').click(function() {
    $("#addItem")[0].textContent = "Add";
    $("#name")[0].value = "";
    $("#qty")[0].value = "";
    $("#price")[0].value = "";
  });

  //Sort by Price
  $("#PriceSort").click(function() {
    if (priceasc == false) {
      sortByPrice(product2);
      RenderList(product2);
      $("#PriceSort").text("▲");
      priceasc = true;
    } else {
      product2.reverse();
      RenderList(product2);
      $("#PriceSort").text("▼");
      priceasc = false;
    }
  });

  //Sort by Name
  $("#qtyName").click(function() {
    if (qtyasc == false) {
      sortByName(product2);
      RenderList(product2);
      $("#qtyName").text("▲");
      qtyasc = true;
    } else {
      product2.reverse();
      RenderList(product2);
      $("#qtyName").text("▼");
      qtyasc = false;
    }
  });
  //Add new product/ Update product
  $("#addItem").click(function() {
    if (update == false) {
      let name = $("#name").val();
      let quantity = parseInt($("#qty").val());
      let price = parseFloat(
        $("#price")
          .val()
          .replace("$ ", "")
          .replace(/,/g, "")
      );

      Check_Error();
      if (!error) {
        product2.push({
          name,
          quantity,
          price
        });
        RenderList(product2);
        error = false;
      }
    } else {
      //Update Product
      product2[index].name = $("#name").val();
      product2[index].quantity = parseInt($("#qty").val());
      product2[index].price = parseFloat(
        $("#price")
          .val()
          .replace("$ ", "")
          .replace(/,/g, "")
      );
      Check_Error();
      if (!error) {
        let items__products2 = product2[index];
        product2.splice(index, 1);
        product2.push(items__products2);
        index = product2.length - 1;
        RenderList(product2);
      }
    }
  });

  //Delete products
  $("tbody").on("click", "button.btn.btn-danger", function() {
    index = $(this)
      .parent()
      .parent()
      .index();
  });

  $("#aprove_delete").on("click", function() {
    product2.splice(index, 1);
    RenderList(product2);
    $("#exampleModal").modal("hide");
  });

  //Edit Products
  $("tbody").on("click", "button.btn-success", function() {
    update = true;
    index = $(this)
      .parent()
      .parent()
      .index();
    $("#addItem")[0].textContent = "Update";
    $("#name")[0].value = product2[index].name;
    $("#qty")[0].value = product2[index].quantity;
    $("#price")[0].value = "$ " + moneyFormat(product2[index].price);
  });

  // Focus on Price
  $("#price").focusin(function() {
    let input = $("#price")
      .val()
      .replace("$ ", "")
      .replace(/,/g, "");
    if (input !== "") {
      $("#price").val(parseFloat(input));
    }
  });

  // UnFocus on Price
  $("#price").focusout(function() {
    if (this.value !== "") {
      this.value = "$ " + moneyFormat(this.value);
    }
  });
});

function RenderList(arr) {
  $("tbody").empty();
  product2.forEach(function(item, i, arr) {
    $("tbody").append(
      "<tr><td class='td__57'>" +
        item.name +
        "</td><td class='text-right'>" +
        item.quantity +
        "</td><td class='td__20'>" +
        "$ " +
        moneyFormat(item.price) +
        "</td><td class='td__33 text-center'><button type='button' class='btn btn-success'>Edit</button><button type='button' class='btn btn-danger' data-toggle='modal' data-target='#exampleModal'>Delete</button></td></tr>"
    );
  });
}

//Filter top keawords
let filters = [];
function apply_filter(table, col, text) {
  filters[col] = text;

  $(table)
    .find("tr")
    .each(function(i) {
      $(this).data("passed", true);
    });

  for (index in filters) {
    if (filters[index] !== "any") {
      $(table)
        .find("tr td:nth-child(" + index + ")")
        .each(function(i) {
          if (
            $(this)
              .text()
              .toLowerCase()
              .indexOf(filters[index]) > -1 &&
            $(this)
              .parent()
              .data("passed")
          ) {
            $(this)
              .parent()
              .data("passed", true);
          } else {
            $(this)
              .parent()
              .data("passed", false);
          }
        });
    }
  }

  $(table)
    .find("tr")
    .each(function(i) {
      if (!$(this).data("passed")) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
}

function sortByPrice(arr) {
  arr.sort((a, b) => (a.price > b.price ? 1 : -1));
}

function sortByName(arr) {
  arr.sort((a, b) => (a.name > b.name ? 1 : -1));
}

function moneyFormat(n) {
  return parseFloat(n)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function Check_Error() {
  let error_name = false;
  let error_quantity = false;
  let error_price = false;
  let name = $("#name").val();
  let quantity = parseInt($("#qty").val());
  let price = parseFloat(
    $("#price")
      .val()
      .replace("$ ", "")
      .replace(/,/g, "")
  );
  if (name == "") {
    console.log("Empty name");
    $("#name").addClass("border-danger");
    error_name = true;
  } else if (name.trim().length == 0) {
    console.log("Only spaces");
    $("#name").addClass("border-danger");
    error_name = true;
  } else if (name.length > 15) {
    console.log(">15");
    $("#name").addClass("border-danger");
    error_name = true;
  } else {
    $("#name").removeClass("border-danger");
    error_name = false;
  }

  if (isNaN(quantity)) {
    console.log("no quantity");
    $("#qty").addClass("border-danger");
    error_quantity = true;
  } else {
    $("#qty").removeClass("border-danger");
    error_quantity = false;
  }

  if (!price) {
    console.log("no price");
    $("#price").addClass("border-danger");
    error_price = true;
  } else {
    $("#price").removeClass("border-danger");
    error_price = false;
  }
  if (error_name || error_quantity || error_price) {
    error = true;
  } else {
    error = false;
  }
}
