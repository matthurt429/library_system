/* global Requests */

var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')
var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')

// library id is 135

var libId = 135
var requests = new Requests(libId)
// var baseUrl = `https://floating-woodland-64068.herokuapp.com/libraries/${libId}`

var dataModel = {
  // books : [],
  // borrowers: [],
}

function addBookToPage(bookData){
  var book = bookTemplate.clone()
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt' , bookData.title)
  book.find('.deleteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    var bookId = deleteBook.attr('data-id')

    requests.deleteBook({id: bookId}).then(function(){
      deleteBook.remove()
    })
  })
  bookTable.append(book)
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

function addBorrowerToPage(borrowerData){
  var borrower = borrowerTemplate.clone()
  borrower.attr('data-id' , borrowerData.id)
  borrower.find('.borrowerName').text(`${borrowerData.firstname}  ${borrowerData.lastname}`)
  borrowerTable.append(borrower)
  borrower.find('.deleteButton').on('click', (event) => {
    var deleteBorrower = $(event.currentTarget).parent().parent()
    var borrowerId = deleteBorrower.attr('data-id')

    requests.deleteBorrower({id: borrowerId}).then(function(){
      deleteBorrower.remove()
    })
  })
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
