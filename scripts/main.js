/* global Requests */

var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')
var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')
var borrowerOptionTemplate = $('#templates .borrowerOption')
// library id is 135

var libId = 135
var requests = new Requests(libId)
// var baseUrl = `https://floating-woodland-64068.herokuapp.com/libraries/${libId}`

var dataModel = {
  // books : [],
  // borrowers: [],
}
// THE BOOKDATA ARGUMENT IS PASSED IN FROM THE API
function addBookToPage(bookData){
  // ADD BOOKDATA TO A NEW TABLE ROW
  var book = bookTemplate.clone(true , true)
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt' , bookData.title)

  // THIS DELETES BOOKS
  book.find('.deleteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    var bookId = deleteBook.attr('data-id')

    requests.deleteBook({id: bookId}).then(function(){
      deleteBook.remove()
    })
    decrementBorrowerCount(bookData.borrower_id)
  })
  bookTable.append(book)
  // select the correct borrower for this book
  if(bookData.borrower_id !== null) {
    book.find(`.borrowerOption[value="${bookData.borrower_id}"]`).attr('selected', 'selected')
    incrementBorrowerCount(bookData.borrower_id)
  }
}


var booksPromise = requests.getBooks().then((dataFromServer) => {
  dataModel.books = dataFromServer
  // dataFromServer.forEach((bookData) => {
  //   addBookToPage(bookData)
  // })
})

$('.deleteButton').on('click', (event) => {
  var deleteBorrower = $(event.currentTarget).parent().parent()
  var borrowerId = deleteBorrower.attr('data-id')

  requests.deleteBorrower({id: borrowerId}).then(function(){
    deleteBorrower.remove()
  })
})
// THE borrowerdata  argument is passed in from the api
function addBorrowerToPage(borrowerData){
  //ADDS THE BORROWER TO THE BORROWER TABLE
  var fullName = `${borrowerData.firstname}  ${borrowerData.lastname}`
  var borrower = borrowerTemplate.clone(true, true)
  borrower.attr('data-id' , borrowerData.id)
  borrower.find('.borrowerName').text(fullName)
  borrowerTable.append(borrower)

  //DELETES BORROWER
  borrower.find('.deleteButton').on('click', (event) => {
    var deleteBorrower = $(event.currentTarget).parent().parent()
    var borrowerId = deleteBorrower.attr('data-id')

    requests.deleteBorrower({id: borrowerId}).then(function(){
      deleteBorrower.remove()
    })
  })

  //ADDS BORROWER TO DROP DOWN
  var borrowerOption = borrowerOptionTemplate.clone()
  borrowerOption.text(fullName)
  borrowerOption.attr('value', borrowerData.id)
  $('.borrowerSelect').append(borrowerOption)
}

var borrowersPromise = requests.getBorrowers().then((dataFromServer) => {
  dataModel.borrowers = dataFromServer
  // dataFromServer.forEach((borrowerData) => {
  //   addBorrowerToPage(borrowerData)
  // })
})

$('.deleteButton').on('click', (event) => {
  var deleteBook = $(event.currentTarget).parent().parent()
  var bookId = deleteBook.attr('data-id')

  requests.deleteBook({id: bookId}).then(function(){
    deleteBook.remove()
  })
})


$('#createBookButton').on('click', () => {
  var bookData = {}
  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageUrl').val()


  requests.createBook(bookData).then((dataFromServer) => {
    addBookToPage(dataFromServer)
    $('#addBookModal').modal('hide')
    $('#addBookForm')[0].reset()
  })

})

$('#createBorrowerButton').on('click', () => {
  var borrowerData = {}
  borrowerData.firstname = $('.addBorrowerFirstName').val()
  borrowerData.lastname = $('.addBorrowerLastName').val()

  requests.createBorrower(borrowerData).then((dataFromServer) => {
    addBorrowerToPage(dataFromServer)
    $('#addBorrowerModal').modal('hide')
    $('#addBorrowerForm')[0].reset()
  })
})

var promises = [booksPromise, borrowersPromise]

Promise.all(promises).then(() => {
  dataModel.borrowers.forEach((borrowerData) => {
    addBorrowerToPage(borrowerData)
  })

  dataModel.books.forEach((bookData) => {
    addBookToPage(bookData)
  })
})


function findBookModel(bookId){
  for (var i = 0; i < dataModel.books.length; i++) {
    if(dataModel.books[i].id === bookId) return dataModel.books[i]
  }
}

$('.borrowerSelect').on('change', (event) => {
  var borrowerId = $(event.target).val()
  var bookId = $(event.target).parents('.book').attr('data-id')
  var oldBorrowerId = findBookModel(Number(bookId)).borrower_id
  console.log(oldBorrowerId)
  console.log(borrowerId)
  requests.updateBook({borrower_id: borrowerId, id: bookId}).then(() => {
    incrementBorrowerCount(borrowerId)
    findBookModel(Number(bookId)).borrower_id = Number(borrowerId)
    decrementBorrowerCount(oldBorrowerId)
  })
})

function incrementBorrowerCount(borrowerId){
  var borrowerRow = $(`.borrower[data-id = "${borrowerId}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue + 1)
}

function decrementBorrowerCount(borrowerId){
  var borrowerRow = $(`.borrower[data-id = "${borrowerId}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue - 1)
}

$('.addBookImageUrl').on('input', (event) => {
  var url = $(event.target).val()
  url.length > 0 ? $('.imagePreview').removeClass('hidden') : $('.imagePreview').addClass('hidden')
  $('.imagePreview img').attr('src', url)
})

$('.borrower').on('click', (event) => {
  var borrowerId = $(event.currentTarget).attr('data-id')
  var borrowerName = $(event.currentTarget).find('.borrowerName').text()
  var viewBorrowerModal = $('#viewBorrowerModal')
  viewBorrowerModal.find('#viewBorrowerModalLabel').text(borrowerName)
  viewBorrowerModal.find('.borrowedBooks').text('')
  dataModel.books.forEach((book) => {
    if(book.borrower_id === Number(borrowerId)){
      viewBorrowerModal.find('.borrowedBooks').append('<li>' + book.title + '</li>')
    }
  })
  var noBooksMsg = viewBorrowerModal.find('.noBooksMsg')
  $('.borrowedBooks li').length === 0 ? noBooksMsg.removeClass('hidden') : noBooksMsg.addClass('hidden')
  viewBorrowerModal.modal('show')
})

$('.searchBox input').on('input', (event) =>{
  var searchString = $(event.target).val().toLowerCase()

  dataModel.books.forEach((book) =>{
    var bookRow = $(`.book[data-id="${book.id}"]`)
    if(book.title.toLowerCase().includes(searchString) || book.description.toLowerCase().includes(searchString)){
      bookRow.removeClass('hidden')
    }else{
      bookRow.addClass('hidden')
    }
  })
})
