Visitor Management System SRS: Web Application and Device Accessibility
Here is the updated Software Requirements Specification (SRS) for your visitor management system, incorporating the changes regarding its web application nature and device accessibility for the registration form.

---

Software Requirements Specification (SRS) for Visitor Management System

1. Introduction
   1.1 Purpose
   This document specifies the functional and non-functional requirements for a digital Visitor Management System [1]. The primary goal is to provide a simple, efficient, and cost-effective solution for tracking visitor entries and exits, replacing traditional manual record-keeping methods [1].
   1.2 Scope
   The system will manage the check-in, real-time tracking, and check-out of visitors [2]. It is designed to be operated by non-technical security personnel, focusing on ease of use and affordability [2].
   1.3 Target Audience
   This SRS is intended for the development team, project managers, and stakeholders involved in the design, development, and implementation of the Visitor Management System [2].
   1.4 Product Vision
   To provide a straightforward, digital platform that enhances security and efficiency in managing visitor access, offering clear records and a user-friendly interface for security personnel across various locations, while keeping technical complexity and costs to a minimum [2].
2. Overall Description
   2.1 User Characteristics
   The primary users of this system will be security personnel with minimal technical proficiency [3]. The system interface must be intuitive, requiring minimal training and relying on simple data input and search functions [3].
   2.2 Operating Environment
   The system is expected to operate as a web application, accessible via a standard web browser on various computing devices (e.g., a desktop PC, laptop, tablet, or mobile phone) available at security checkpoints, with a display to show visitor information [3]. It should function reliably in typical office or facility reception environments [3].
   2.3 General Constraints
   • Low-tech and low-cost implementation: Avoidance of specialised hardware like dedicated ID scanners or QR code readers for primary functions [4].
   • User-friendliness: Designed for easy operation by non-technical staff [4].
   • Manual Data Entry Focus: The core check-in and check-out processes will primarily rely on manual data input and lookup, rather than automated scanning technologies [4].
3. Specific Requirements
   3.1 Functional Requirements
   3.1.1 Visitor Check-in Process
   The system shall support the following functionalities for visitor check-in [4]:
   • FR1.1 – Visitor Registration Form: The system shall provide a web-based Visitor Registration Form for security personnel to manually input visitor details [5]. This form can be accessed and generated on the security personnel's phone or computer device [5].
   ◦ FR1.1.1 – Data Fields: The form shall capture the following information for each visitor: name, ID number, phone number, purpose of visit, person for visit, and organisation/company [5].
   ◦ FR1.1.2 – Automatic Date and Time Recording: The system shall automatically record the current date and time of entry upon the completion of a visitor's check-in [5].
   ◦ Exclusion: The system shall not include features for QR code generation, QR code scanning, or automatic ID scanning during the check-in process, aligning with the low-tech requirement [5].
   3.1.2 Data Storage and Display
   The system shall manage visitor data as follows [6]:
   • FR2.1 – Database Storage: All visitor details, once entered, shall be saved to a secure database (e.g., PostgreSQL/MySQL) [6].
   • FR2.2 – Current Visitors Display: The system shall present a Visitor Management Dashboard or a similar interface that displays all currently visiting individuals [6]. This display should clearly indicate who is currently on-site [6].
   • FR2.3 – Comprehensive Visitor Logs Display: The system shall also provide an interface to view all visitor data, including records of individuals who are not currently at the location (historical visitor logs) [6]. This will serve as a complete digital record [6].
   • FR2.4 – Digital Record-Keeping: The system shall maintain digital visitor logs and analytics, which will replace traditional manual record-keeping methods, thereby eliminating issues such as illegibility and poor auditability [6].
   3.1.3 Visitor Check-out Process
   The system shall facilitate visitor check-out [7]:
   • FR3.1 – Searchable Log for Check-out: Security personnel shall be able to filter and find a visitor's record for check-out by entering their ID number or phone number [7]. The system should also support searching by name [7].
   ◦ FR3.1.1 – Smart Search Suggestions: The system may offer smart suggestions to autocomplete names as they are typed during the search process, especially for returning visitors, to streamline finding records [7].
   • FR3.2 – Check-out Functionality: Once a visitor's record is identified, security staff shall be able to mark the visitor as checked out [7].
   • FR3.3 – Log and Display Update: Upon check-out, the system shall update the visitor logs with the check-out time and remove the visitor from the "currently visiting" display [7].
   • Exclusion: The system shall not incorporate QR code check-in functionality for the check-out process [7].
   3.2 Non-Functional Requirements
   3.2.1 Usability (NFR-US)
   • NFR-US.1 – Intuitive Interface: The system's user interface shall be intuitive and easy for non-technical security personnel to navigate, requiring minimal training to operate effectively [8].
   • NFR-US.2 – Clear Data Entry: All forms and input fields shall be clearly labelled and straightforward, reducing the chance of input errors [8].
   3.2.2 Performance (NFR-PE)
   • NFR-PE.1 – Quick Search: The system shall retrieve visitor records for check-out within 2 seconds under normal operating conditions [8].
   • NFR-PE.2 – Efficient Processing: Visitor check-in and check-out processes, from data input/search to record update, shall complete within 5 seconds [8].
   3.2.3 Cost-effectiveness (NFR-CE)
   • NFR-CE.1 – Minimal Hardware Dependency: The system shall be designed to operate without reliance on specialised or expensive hardware, consistent with the user's "low techy and as cheap as possible" requirement [9].
   • NFR-CE.2 – Open-Source Utilisation: The development shall prioritise the use of cost-effective, open-source technologies (e.g., PostgreSQL/MySQL for the database) where feasible, to minimise licensing costs [9].
   3.2.4 Reliability and Data Integrity (NFR-RD)
   • NFR-RD.1 – Data Persistence: The system shall reliably store all visitor data in the database, ensuring no loss of information upon system closure or restart [10].
   • NFR-RD.2 – Data Accuracy: The system shall maintain the integrity and accuracy of all visitor records, preventing corruption or unauthorised alteration of data [10].
   3.2.5 Scalability (NFR-SC)
   • NFR-SC.1 – Data Volume Handling: The system shall be capable of efficiently managing and querying a growing volume of visitor records over time, without significant degradation in performance [10].
   3.2.6 Compliance Support (NFR-CS)
   • NFR-CS.1 – Auditable Records: The system shall maintain accurate, auditable digital records of all visitor activities, which aids in achieving regulatory compliance by addressing issues like poor auditability associated with paper-based systems [11].
