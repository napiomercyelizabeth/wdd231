const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 2, completed: false }
];

const courseListContainer = document.getElementById('course-list');
const totalCreditsContainer = document.getElementById('total-credits');

function displayCourses(filteredCourses) {
    courseListContainer.innerHTML = '';
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) card.classList.add('completed');
        card.innerHTML = `<h3>${course.subject} ${course.number}</h3><p>${course.title}</p><p>Credits: ${course.credits}</p>`;
        courseListContainer.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsContainer.textContent = `Total Credits: ${totalCredits}`;
}

document.getElementById('all').addEventListener('click', () => displayCourses(courses));
document.getElementById('cse').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'CSE')));
document.getElementById('wdd').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'WDD')));

displayCourses(courses);

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;