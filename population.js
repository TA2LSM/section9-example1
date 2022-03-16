const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

//--- Referencing Documents ---
const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    // Aşağıdaki kısım olmadan sadece kurs ismi ile yeni kurs oluşturulur.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author", //Yukarıdaki "Author" modelini referans alarak veri oluşturulacak
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    //.select("name");
    //.populate("author")
    //.populate("author", "name") // sadce isim görüntülenir
    .populate("author", "name -_id") // sadce isim görüntülenir ve "_id" görüntülenmez
    //.populate("category", "name") // birden fazla döküman için de bu işlem yapılabilir. (category olsaydı mesela)
    .select("name author");
  // bu listelemede "author" ismi gözükmez. sadece referans id gözükür. Bu nedenle
  // yukarıdaki .populate() metodu kullanılıyor.
  console.log(courses);
}

//createAuthor("TA2LSM", "My bio", "My Website");

//createCourse("Node Course", "6231db5058fd29aefcf099e3"); // name, author_id
// author_id hatalı da olsa mongoDB hata vermez. listeleme yaparken "null" gösterilir

listCourses();
