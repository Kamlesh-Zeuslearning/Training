const courses = [
    {
        courseName: "Acceleration",
        courseImage: "dashboard-Assests/imageMask.png",
        courseSubject: "Physics",
        courseGrade: 7,
        courseCount: 2,
        CourseUnits: 4,
        courseLessons: 18,
        courseTopics: 24,
        CourseFaculty: "Mr. Frank's Class B",
        students: 50,
        startDate: "21-Jan-2020",
        endDate: "21-Aug-2020",
        isFavorite: true,
    },
    {
        courseName: "Displacement, Velocity and Speed",
        courseImage: "dashboard-Assests/imageMask-1.png",
        courseSubject: "Physics",
        courseGrade: 6,
        courseCount: 3,
        CourseUnits: 2,
        courseLessons: 15,
        courseTopics: 20,
        CourseFaculty: null,
        students: null,
        startDate: null,
        endDate: null,
        isFavorite: true,
    },
    {
        courseName:
            "Introduction to Biology: Micro organisms and how they affec...",
        courseImage: "dashboard-Assests/imageMask-3.png",
        courseSubject: "Biology ",
        courseGrade: 4,
        courseCount: 1,
        CourseUnits: 5,
        courseLessons: 16,
        courseTopics: 22,
        CourseFaculty: "Mr. Frank's Class A",
        students: 300,
        startDate: null,
        endDate: null,
        isFavorite: true,
    },
    {
        courseName: "Introduction to High School Mathematics",
        courseImage: "dashboard-Assests/imageMask-4.svg",
        courseSubject: "Mathematics",
        courseGrade: 8,
        courseCount: 3,
        CourseUnits: null,
        courseLessons: null,
        courseTopics: null,
        CourseFaculty: "Mr. Frank's Class A",
        students: 44,
        startDate: "14-Oct-2019",
        endDate: "20-Oct-2020",
        isFavorite: false,
    },
];

const items = document.getElementById("items");

courses.forEach((course) => {
    const item = document.createElement("div");
    item.classList.add("item");

    const itemDetail = document.createElement("div");
    itemDetail.classList.add("item-detail");
    item.appendChild(itemDetail);

    let img = document.createElement("img");
    img.src = course.courseImage;
    itemDetail.appendChild(img);

    const itemText = document.createElement("div");
    itemText.classList.add("item-text");
    itemDetail.appendChild(itemText);

    const itemName = document.createElement("div");
    itemName.classList.add("space-between");
    itemText.appendChild(itemName);

    const chapterName = document.createElement("div");
    chapterName.classList.add("chapter-name");
    chapterName.textContent = course.courseName;
    itemName.appendChild(chapterName);

    const favIcon = document.createElement("img");
    favIcon.src = "dashboard-Assests/favourite.svg";
    if(!course.isFavorite){
        favIcon.classList.add("star")
    }
    itemName.appendChild(favIcon);

    const subject = document.createElement("div");
    subject.classList.add("subject");
    subject.innerHTML = `${course.courseSubject} <span class="hr-sm"></span> Grade ${course.courseGrade} <span class="green">+${course.courseCount}</span>`;
    itemText.appendChild(subject);

    const chapter = document.createElement("div");
    chapter.classList.add("chapter");
    if (course.CourseUnits !== null) {
        chapter.innerHTML = `<strong>${course.CourseUnits}</strong> Units <strong>${course.courseLessons} </strong> Lessons <strong>${course.courseTopics}</strong> Topics`;
    }
    itemText.appendChild(chapter);

    const courseName = document.createElement("div");
    courseName.classList.add("name");
    itemText.appendChild(courseName);

    // Course Name Dropdown
    const courseNameSelect = document.createElement("select");
    const option1 = document.createElement("option");
    option1.value = "";
    option1.textContent = "Mr. Frank's Class B";
    courseNameSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = "";
    option2.textContent = "Mr. Frank's Class A";
    courseNameSelect.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = "";
    option3.textContent = "All classes";
    courseNameSelect.appendChild(option3);

    const option4 = document.createElement("option");
    option4.value = "";
    option4.textContent = "No Classes";
    courseNameSelect.appendChild(option4);

    courseName.appendChild(courseNameSelect);

    const genDetails = document.createElement("div");
    genDetails.classList.add("gen-details");
    if (course.students === null) {
    } else if (course.startDate === null) {
        genDetails.innerHTML = `${course.students} Students`;
    } else {
        genDetails.innerHTML = `${course.students} Students  <span class="hr-sm"></span> ${course.startDate} - ${course.endDate}`;
    }
    itemText.appendChild(genDetails);

    const itemOption = document.createElement("div");
    itemOption.classList.add("item-option");
    item.appendChild(itemOption);

    itemOption.innerHTML = `
        <img src="preview.svg" alt="" />
        <img src="dashboard-Assests/manage course.svg" alt="" />
        <img src="dashboard-Assests/grade submissions.svg" />
        <img src="dashboard-Assests/reports.svg" alt="" />
    `;

    items.appendChild(item);
});
