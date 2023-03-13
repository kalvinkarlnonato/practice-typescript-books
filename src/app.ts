import express, { Application, Request, Response } from "express";
import mongoose, { Schema, model, Document, Mongoose } from "mongoose";
import bodyParser from "body-parser";
import config from "config";
import { errorHandler } from "./errorHandler";

const app: Application = express();
const PORT: number = config.get<number>("PORT");
const DBURI: string = config.get<string>("DBURI");
const DBNAME: string = config.get<string>("DBNAME");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(DBURI)
  .then((conn) =>
    console.log(`Database ${DBNAME} is connected to ${conn.connection.host}`)
  )
  .catch(() => console.log("Error connecting to database"));

interface IBook extends Document {
  title: string;
  description?: string;
}

const bookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

// bookSchema.pre("save", function (next: (err?: Error) => void) {
//   let book = this as IBook;
//   if (!book.isModified("title")) {
//     return next();
//   } else {
//     book.title = book.title + ":modified";
//     return next();
//   }
// });

const BookModel = model("Book", bookSchema);
// Get books
app.get("/books", (req: Request, res: Response) => {
  BookModel.find()
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      res.status(400).send({ message: "There is error finding book", ...err });
    });
});
// Add a book
app.post("/books", (req: Request, res: Response) => {
  BookModel.create({
    title: req.body.title,
    description: req.body.description,
  })
    .then((book) => {
      res.status(200).send({ message: "Successfully added", book });
    })
    .catch((err) => {
      res.status(400).send({ message: "There is error creating book", ...err });
    });
});
// Update a book
app.put("/books/:id", (req: Request, res: Response) => {
  BookModel.findById(req.params.id).then((book) => {
    if (!book) {
      res.status(400).send({ message: "Book not found" });
    } else {
      BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((book) => {
          res.status(200).send({ message: "Successfully edited book", book });
        })
        .catch((error) => {
          res
            .status(400)
            .send({ message: "There is error in editing the book", ...error });
        });
    }
  });
});
// Delete a book
app.delete("/books/:id", (req: Request, res: Response) => {
  BookModel.findById(req.params.id).then((book) => {
    if (!book) {
      res.status(400).send({ message: "Book not found" });
    } else {
      BookModel.findByIdAndRemove(req.params.id)
        .then((book) => {
          res
            .status(200)
            .send({ message: "Successfully deleted a book", book });
        })
        .catch((error) => {
          res
            .status(400)
            .send({ message: "There is error deleting the book", ...error });
        });
    }
  });
});

app.get("*", (req: Request, res: Response) => {
  res.status(400);
  throw new Error("This path is not available");
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
