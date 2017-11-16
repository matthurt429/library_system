var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')
var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')

// library id is 135

var libId = 135
var baseUrl = `https://floating-woodland-64068.herokuapp.com/libraries/${libId}`


function addBookToPage(bookData){
  var book = bookTemplate.clone()
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt' , bookData.title)
  book.find('.delteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    console.log(deleteBook)
    var deleteBookRequest = $.ajax({
      type: 'DELETE',
      url:`${baseUrl}/books/${deleteBook.attr('data-id')}`
    })
    deleteBookRequest.done(function(){
      deleteBook.remove()
    })
  })
  bookTable.append(book)
}

var getBooksRequest = $.ajax({
  type:'GET',
  url: `${baseUrl}/books`,
})

getBooksRequest.done((dataFromServer) => {
  dataFromServer.forEach((bookData) => {
    addBookToPage(bookData)
  })
  $('.delteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    console.log(deleteBook)
    var deleteBookRequest = $.ajax({
      type: 'DELETE',
      url:`${baseUrl}/books/${deleteBook.attr('data-id')}`
    })
    deleteBookRequest.done(function(){
      deleteBook.remove()
    })
  })
})

function addBorrowerToPage(borrowerData){
  var borrower = borrowerTemplate.clone()
  borrower.attr('data-id' , borrowerData.id)
  borrower.find('.borrowerFirstName').text(borrowerData.firstname)
  borrower.find('.borrowerLastName').text(borrowerData.lastname)
  borrower.find('.delteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    console.log(deleteBook)
    var deleteBookRequest = $.ajax({
      type: 'DELETE',
      url:`${baseUrl}/borrowers/${deleteBook.attr('data-id')}`
    })
    deleteBookRequest.done(function(){
      deleteBook.remove()
    })
  })
  borrowerTable.append(borrower)
}

var getBorrowersRequest = $.ajax({
  type:'GET',
  url:`${baseUrl}/borrowers`,
})

getBorrowersRequest.done((dataFromServer) =>{
  dataFromServer.forEach((borrowerData) => {
    addBorrowerToPage(borrowerData)
  })
  $('.delteButton').on('click', (event) => {
    var deleteBook = $(event.currentTarget).parent().parent()
    console.log(deleteBook)
    var deleteBookRequest = $.ajax({
      type: 'DELETE',
      url:`${baseUrl}/borrowers/${deleteBook.attr('data-id')}`
    })
    deleteBookRequest.done(function(){
      deleteBook.remove()
    })
  })
})


$('#createBookButton').on('click', (event) => {
  var bookData = {}
  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageUrl').val()

  var createBookRequest =  $.ajax({
    type: 'POST',
    url:`${baseUrl}/books`,
    data:{
      book:bookData
    }
  })
  createBookRequest.done((dataFromServer) =>{
    addBookToPage(dataFromServer)
    $('#addBookModal').modal('hide')
    $('#addBookForm')[0].reset()
  })
})

$('#createBorrowerButton').on('click', (event) => {
  var borrowerData = {}
  borrowerData.firstname = $('.addBorrowerFirstName').val()
  borrowerData.lastname = $('.addBorrowerLastName').val()

  var createBorrowerRequest = $.ajax({
    type: 'POST',
    url:`${baseUrl}/borrowers`,
    data:{
      borrower:borrowerData
    }
  })
  createBorrowerRequest.done((dataFromServer) =>{
    addBorrowerToPage(dataFromServer)
    $('#addBorrowerModal').modal('hide')
    $('#addBorrowerForm')[0].reset()
  })
})
