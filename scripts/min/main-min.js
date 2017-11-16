var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')
// library id is 135

var libId = 135
var baseUrl = `https://floating-woodland-64068.herokuapp.com/libraries/${libId}`


function add_book_to_page(bookData){
  var book = bookTemplate.clone()
  book.attr('data-id', bookData.id)
  book.find('.bookTitle').text(bookData.title)
  book.find('.bookImage').attr('src', bookData.image_url)
  book.find('.bookImage').attr('alt' , bookData.title)
  bookTable.append(book)
}

var getBooksRequest = $.ajax({
  type:'GET',
  url: `${baseUrl}/books`,
})

getBooksRequest.done((dataFromServer) => {
  dataFromServer.forEach((bookData) => {
    add_book_to_page(bookData)
  })
})


