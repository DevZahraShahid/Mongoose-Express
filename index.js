// 1- Connect to MongoDB using MOngoose
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.error("Could not connect to MongoDB..", err));

// 2- Create Schema for the collection
const courseSchema = mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  // tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,

  //Built-in Validator
  // category: {
  //   type: String,
  //   required: true,
  //   enum: ["School", "College", "phD"], // must include only these
  // },

  //Custom Validator
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A course should have atleast one tag",
    },
  },

  //ASYNC Validator
  // tags: {
  //   type: Array,
  //   validate: {
  //     isAsync: true,
  //     validator: function (v, callback) {
  //       setTimeout(() => {
  //         const result = v && v.length > 0;
  //         callback(result);
  //       }, 2000);
  //     },
  //     message: "A course should have atleast one tag",
  //   },
  // },
});

//Class, Object
//Course, nodeCourse

// 3- Define Class
const Course = mongoose.model("Course", courseSchema);

// 4- CRreate objects using ASYNC/AWAIT - as .save(), .find() returns a promise
async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Mosh",
    tags: ["full stack"],
    isPublished: true,
  });

  try {
    const result = await course.save(); //returns an ID
    console.log(result);
  } catch (exc) {
    // To list down all the errors
    for (field in exc.errors) {
      console.log(exc.errors[field].message);
    }
  }
}
// createCourse();

async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}
// getCourses();

async function getFilteredCourses() {
  //Pagination
  const pageNumber = 2;
  const pageSize = 20;

  const courses = await Course.find({ author: "Zahra", isPublished: true })
    // .find({ price: { $in: [10, 30, 50] } })  // comparison operators
    // .or([{ author: "Mosh", isPublished: true }])  // logical operators
    // .find({ author: /^Mosh/ }) // starts with
    // .find({ author: /Hamedani$/i }) //ends with
    // .find({ author: /.*M.*/i }) // contains M

    //Pagination
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)

    .limit(5)
    .sort({ date: 1 }) // 1 => ascending
    .select({ name: 1, tags: 1 }) // properties to be included
    .count(); //count the documents after filtering
  console.log(courses);
}
// getFilteredCourses();

// Query first - Update
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;
  course.isPublished = true;
  course.author = "Anonymous";
  const result = await course.save();
  console.log(result);
}
// updateCourse("62f5f0c8ab9f17470eb4d78c");

//Update first - Update
async function updateCourseDirectly(id) {
  const result = await Course.update(
    { _id: id },
    {
      $set: {
        author: "Mosh",
        isPublished: false,
      },
    }
  );
  console.log(result);
}
// updateCourseDirectly("62f5f0ff76902241b6f7344d");

// Remove
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
// removeCourse("62fa2ff4e23e07d58f26292b");
