Prompt for Firebase Studio: Visitor Management System
Objective:
Develop a single-page web application for a low-cost, low-tech Visitor Management System based on the provided Software Requirements Specification (SRS). The application should be intuitive for non-technical security personnel and operate on standard web browsers.

Core Requirements from SRS:

Technology Stack:

Frontend: A single HTML file using standard HTML, CSS (Tailwind CSS for a clean, responsive design), and JavaScript.

Backend: Firebase services, specifically Firebase Authentication for anonymous user sign-in and Firestore as the primary database.

Authentication:

Implement an anonymous sign-in process. The user should not be required to enter any credentials to access the application. The system should handle user authentication automatically upon first load.

User Interface (UI):

Create a single-page, mobile-responsive dashboard.

The UI should have three distinct sections:

A Check-in Form section.

A Current Visitors section.

A Search & Check-out section.

Use a clean, intuitive design with clear labels and a modern, simple aesthetic that prioritizes usability for non-technical users.

Functional Requirements:

Visitor Check-in Process:

Create a form with the following input fields:

Name (string)

ID Number (string)

Phone Number (string)

Purpose of Visit (string)

Person for Visit (string)

Organisation/Company (string)

Upon form submission, a new record must be created in a Firestore collection named visitors.

Automatically add a checkInTime timestamp to the new document.

The document should also have a checkOutTime field, initially set to null.

Data Storage and Display:

Use Firestore to store all visitor records.

The Current Visitors section should display a real-time list or table of visitors who are currently on-site (i.e., those with a checkOutTime of null). This section must update automatically as visitors are checked in or out.

Implement a separate interface or a collapsible section to show Historical Visitor Logs (all records, regardless of their checkOutTime).

Visitor Check-out Process:

Include a search bar that allows security personnel to search for a visitor by their ID number or phone number.

When a visitor record is found and selected, provide a "Check Out" button.

Clicking the button must update the corresponding Firestore document by setting the checkOutTime field to the current timestamp.

The system must automatically remove the visitor from the Current Visitors list upon successful check-out.

Non-Functional Requirements:

Usability: Ensure all forms and fields are clearly labeled and easy to use.

Performance: The search functionality should be fast and responsive, preferably filtering a real-time dataset retrieved with a single onSnapshot query.

Data Integrity: All data must be persisted reliably in Firestore.

Cost-effectiveness: Design should avoid complex features or dependencies on external APIs, keeping the solution simple and affordable.

Final Output:
The final code should be in a single, well-structured index.html file that includes all HTML, Tailwind CSS, and JavaScript. The JavaScript must handle Firebase initialization, authentication, and all CRUD operations on the Firestore database, as well as updating the UI in real time.
