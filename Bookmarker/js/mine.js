var book_Name_Input = document.getElementById("book-Name");
var bookm_URL_Input = document.getElementById("book-URL"); 
var btn_add = document.getElementById("btn_add"); 
var book_Table_data = document.getElementById("table-data"); 
var Btn_close_Modal = document.getElementById("Btn_close"); 
var modalBox = document.querySelector(".box-info"); 
var bookmarksList = []; 

if (localStorage.getItem("bookmarksList")) {
  bookmarksList = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarksList.forEach((_, index) => displayBookmark(index));
}

function displayBookmark(bookmarkIndex) {
  var bookmarkData = bookmarksList[bookmarkIndex];
  var siteURL = bookmarkData.siteURL;
  
  var httpsRegex = /^https?:\/\//g;
  var validURL = httpsRegex.test(siteURL) ? siteURL : `https://${siteURL}`;
  var fixedURL = httpsRegex.test(siteURL) ? siteURL.replace(httpsRegex, "") : siteURL;

  var bookmarkRow = `
    <tr>
      <td>${bookmarkIndex + 1}</td>
      <td>${bookmarkData.siteName}</td>
      <td>
        <button class="btn btn-visit" data-index="${bookmarkIndex}">
          <i class="fa-solid fa-eye pe-2"></i>زيارة
        </button>
      </td>
      <td>
        <button class="btn btn-delete" data-index="${bookmarkIndex}">
          <i class="fa-solid fa-trash-can"></i>حذف
        </button>
      </td>
    </tr>
  `;
  book_Table_data.innerHTML += bookmarkRow;

  initializeButtonEvents();
}

function initializeButtonEvents() {
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", deleteBookmark);
  });

  document.querySelectorAll(".btn-visit").forEach((button) => {
    button.addEventListener("click", visitWebsite);
  });
}

function clearInputs() {
  book_Name_Input.value = "";
  bookm_URL_Input.value = "";
}

function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

btn_add.addEventListener("click", function () {
  if (book_Name_Input.classList.contains("is-valid") && bookm_URL_Input.classList.contains("is-valid")) {
    var newBookmark = {
      siteName: capitalizeText(book_Name_Input.value),
      siteURL: bookm_URL_Input.value,
    };

    bookmarksList.push(newBookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
    displayBookmark(bookmarksList.length - 1);
    clearInputs();

    book_Name_Input.classList.remove("is-valid");
    bookm_URL_Input.classList.remove("is-valid");
  } else {
    modalBox.classList.remove("d-none"); // عرض الرسالة التحذيرية
  }
});

function deleteBookmark(event) {
  var bookmarkIndex = event.target.dataset.index;
  bookmarksList.splice(bookmarkIndex, 1); 
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList)); 
  book_Table_data.innerHTML = ""; // تنظيف الجدول
  bookmarksList.forEach((_, index) => displayBookmark(index)); // إعادة عرض البيانات
}

function visitWebsite(event) {
  var bookmarkIndex = event.target.dataset.index;
  var siteURL = bookmarksList[bookmarkIndex].siteURL;

  if (/^https?:\/\//.test(siteURL)) {
    window.open(siteURL);
  } else {
    window.open(`https://${siteURL}`);
  }
}

var nameRegex = /^\w{3,}(\s+\w+)*$/; // التحقق من أن الاسم لا يقل عن 3 أحرف
var urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}(\/\S*)?$/i; // التحقق من صحة الرابط

book_Name_Input.addEventListener("input", function () {
  if (nameRegex.test(book_Name_Input.value)) {
    book_Name_Input.classList.add("is-valid");
  } else {
    book_Name_Input.classList.remove("is-valid");
  }
});

bookm_URL_Input.addEventListener("input", function () {
  if (urlRegex.test(bookm_URL_Input.value)) {
    bookm_URL_Input.classList.add("is-valid");
  } else {
    bookm_URL_Input.classList.remove("is-valid");
  }
});

Btn_close_Modal.addEventListener("click", function () {
  modalBox.classList.add("d-none");
});
