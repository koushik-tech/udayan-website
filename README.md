# Udayan Website | Public & Secure Transactions Portal 🌳✨

A **premium, modern, responsive website** built for the social organisation **Udayan**. 

This website serves as the beautiful public face of the organisation, allowing visitors to explore active departments (wings) and register for community events. It also houses a fully integrated, secure, role-based **On-site Transactions Console** to manage member subscription clearings, event rosters, and volunteer application logs.

---

## 🎨 Premium Visual & Design System

*   **Indigo, Teal & Solar Brand Colors**: Perfectly aligned with Udayan brand guidelines, featuring Indigo & Teal HSL variables (`--primary-hsl: 250, 89%, 65%` and `--secondary-hsl: 174, 84%, 41%`) with a new glowing gold/orange **Rising Sun** solar accent.
*   **Dual Light & Dark Themes**: Site-wide Light and Dark mode toggles with persistent memory supported automatically via the browser's `localStorage`.
*   **Tactile Rising Sun Brand Logo**: The brand header features a radiant, animated glowing sun logo (`brand-logo-sun`) symbolizing optimism and community growth.
*   **Fluid Responsive Grids**: Adapts dynamically across Mobile, Tablet, and Desktop screen formats.

---

## 🔒 Secure On-Site Log In & Role-Based Permissions

Instead of linking to a separate app, administrators, teachers, students, and general members can log in **directly on the website** via a glassmorphic authentication panel. 

The site evaluates credentials in real time against the shared local database key `social_org_users_database`. It establishes a **Single Sign-On (SSO)** session (`social_org_auth_session`), matching the credentials configured in the PWA administrative app:
*   `admin` / `admin123` (Admin Role)
*   `teacher` / `teacher123` (Teacher Role)
*   `student` / `student123` (Student Role)
*   `member` / `member123` (Member Role)

Logging in dynamically reveals the **Member & Admin Transaction Console** with privileges tailored exactly to the authenticated user's role:

| Role | Subscriptions Ledger | Event Registries | Enrolment Inbox |
| :--- | :--- | :--- | :--- |
| **Admin** | **Full Access** (View balances, filter overdue members, record billing payments) | **Full Access** (Choose events, assign participants, remove registries) | **Full Access** (Audit volunteer files, process queue logs) |
| **Teacher** | *Restricted* (Access Denied overlay) | **Full Access** (Assign and de-register participants from event lists) | *Restricted* (Access Denied overlay) |
| **Student** | *Restricted* (Access Denied overlay) | *Read-Only* (Can view participant registries; adding or removing is disabled) | *Restricted* (Access Denied overlay) |
| **Member** | *Personal Profile* (Can only view their own personal subscription cleared statuses) | *Restricted* (Access Denied overlay) | *Restricted* (Access Denied overlay) |

---

## 🚀 Transactional Actions Supported

1.  **Subscriptions Ledger Billing**:
    *   Lists all registered members with real-time searches and Clearing Status tags (**Cleared**, **Overdue**, **Pending**).
    *   Clicking **Bill** on a member autofills the billing record drawer.
    *   Records transactions, advances cleared months, generates custom invoice references (`BILL-2026-XXX`), and logs events in the Session log stream. All modifications write-through to the shared database key `social_org_db_persons`.
2.  **Event Registries Planners**:
    *   Lists active events on the left, displaying participant counts.
    *   Clicking an event shows its active participant roster on the right.
    *   Allows managers to assign new members to the event roster or de-register participants in real time. Write-through to `social_org_db_events`.
3.  **Submitted Applications Queue**:
    *   Displays general contact inquiries or volunteer join forms submitted by public users in real time.
    *   Provides actions to mark logs as processed or clean up the inbox queue.

---

## 📂 File Architecture

*   [`index.html`](file:///C:/Users/Smita%20Dey/udayan360-website/index.html): Layout holding public sections, modals, and the new secure transactions dashboard.
*   [`styles.css`](file:///C:/Users/Smita%20Dey/udayan360-website/styles.css): Glowing rising sun solar vectors, glassmorphism dashboard tables, payment drawer inputs, and alert states.
*   [`script.js`](file:///C:/Users/Smita%20Dey/udayan360-website/script.js): Controller matching logins against `social_org_users_database`, executing billing updates, updating participant registry rosters, and sorting inquiries logs.

---

## 📥 How to Run the Website

Since the website is built with a **zero-dependency model**, it requires no Node installations or compilers:

### Method 1: Direct Execution (Double-Click)
1. Open the project folder `C:\Users\Smita Dey\udayan360-website` in Windows File Explorer.
2. Double-click the `index.html` file to launch the website immediately in any web browser.

### Method 2: Python Local HTTP Web Server
1. Open PowerShell or command terminal.
2. Enter the project directory:
   ```powershell
   cd "C:\Users\Smita Dey\udayan360-website"
   ```
3. Start the local server:
   ```powershell
   python -m http.server 8080
   ```
4. Access `http://localhost:8080` in your web browser.
