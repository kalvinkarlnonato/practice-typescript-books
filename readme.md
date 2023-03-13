# This is my activity created API routes:
## <span style="color:yellow">POST</span> Create a book
`http://localhost:3000/books`
### Body
- title : string
- description : string

---
## <span style="color:green">GET</span> Read all books
`http://localhost:3000/books`

---
## <span style="color:blue">PUT</span> Update a book
`http://localhost:3000/books/:id`
### Path vairables
- id : objectId
### Body
- title : string
- description : string

---
## <span style="color:red">DELETE</span> Delete a book
`http://localhost:3000/books/:id`