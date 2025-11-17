# Complete Guide: How to View Signed-Up Users

## 🎯 Quick Answer
Your user signup data is currently stored in **Browser LocalStorage** (client-side). To view users, follow the methods below.

---

## Method 1: View Users in Browser (Current Setup) 🌐

### Using Browser Developer Tools:

#### **Chrome/Edge:**
1. Open your website (e.g., `index.html`)
2. Press `F12` or `Right-click → Inspect`
3. Go to **"Application"** tab
4. In left sidebar: **Local Storage** → Click your website URL
5. Find the key **`users`** → Click to view all registered users

#### **Firefox:**
1. Open your website
2. Press `F12`
3. Go to **"Storage"** tab
4. **Local Storage** → Click your website URL
5. Find **`users`** key

#### **Using Browser Console:**
1. Press `F12` → Go to **"Console"** tab
2. Type and press Enter:
```javascript
// View all users
JSON.parse(localStorage.getItem('users'))

// View in a formatted table
console.table(JSON.parse(localStorage.getItem('users')))

// Count total users
JSON.parse(localStorage.getItem('users')).length

// View currently logged-in user
JSON.parse(localStorage.getItem('currentUser'))
```

### Create a Simple Admin Page:

You can create an admin page to view all users easily:

**File: `admin.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Admin - View Users</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #088178; color: white; }
        tr:hover { background-color: #f5f5f5; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #088178; color: white; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>User Management Dashboard</h1>
    
    <div class="stats">
        <div class="stat-card">
            <h3>Total Users</h3>
            <p id="total-users">0</p>
        </div>
    </div>

    <button onclick="loadUsers()">Refresh Users</button>
    <button onclick="exportUsers()">Export to CSV</button>
    <button onclick="clearAllUsers()">Clear All Users</button>

    <table id="users-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="users-body">
        </tbody>
    </table>

    <script>
        function loadUsers() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const tbody = document.getElementById('users-body');
            tbody.innerHTML = '';
            
            document.getElementById('total-users').textContent = users.length;

            users.forEach(user => {
                const row = tbody.insertRow();
                const date = new Date(user.id).toLocaleString();
                
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${date}</td>
                    <td>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                        <button onclick="viewUser(${user.id})">View Details</button>
                    </td>
                `;
            });
        }

        function deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users = users.filter(user => user.id !== userId);
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                alert('User deleted successfully!');
            }
        }

        function viewUser(userId) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id === userId);
            if (user) {
                alert(`User Details:\n\nID: ${user.id}\nUsername: ${user.username}\nEmail: ${user.email}\nRegistered: ${new Date(user.id).toLocaleString()}`);
            }
        }

        function exportUsers() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            let csv = 'ID,Username,Email,Registration Date\n';
            
            users.forEach(user => {
                const date = new Date(user.id).toLocaleString();
                csv += `${user.id},${user.username},${user.email},${date}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users_export.csv';
            a.click();
        }

        function clearAllUsers() {
            if (confirm('⚠️ WARNING: This will delete ALL users! Are you sure?')) {
                localStorage.removeItem('users');
                loadUsers();
                alert('All users have been cleared!');
            }
        }

        // Load users on page load
        loadUsers();
    </script>
</body>
</html>
```

---

## Method 2: View Users in MySQL Database (Recommended) 🗄️

### Prerequisites:
1. MySQL Server installed and running
2. Database created using `database_schema.sql`

### Steps to View Users:

#### **Option A: Using MySQL Workbench (GUI)**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Select database: `USE ecommerce_db;`
4. Run query: `SELECT * FROM users;`

#### **Option B: Using Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Select database
USE ecommerce_db;

# View all users
SELECT * FROM users;

# View users with formatted output
SELECT 
    id,
    username,
    email,
    created_at as 'Registration Date'
FROM users
ORDER BY created_at DESC;

# Count total users
SELECT COUNT(*) as 'Total Users' FROM users;

# Search specific user
SELECT * FROM users WHERE username = 'john_doe';
SELECT * FROM users WHERE email LIKE '%@gmail.com';

# View recent registrations
SELECT * FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

#### **Option C: Using phpMyAdmin**
1. Open phpMyAdmin in browser (usually `http://localhost/phpmyadmin`)
2. Login with your MySQL credentials
3. Click on `ecommerce_db` database
4. Click on `users` table
5. Click "Browse" to see all users

---

## Method 3: Create a Backend API to View Users 📡

### Create a User Management Servlet (Java):

**File: `src/main/java/com/ecommerce/servlet/UserServlet.java`**
```java
package com.ecommerce.servlet;

import com.ecommerce.DatabaseConnection;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/api/users")
public class UserServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        JSONArray usersArray = new JSONArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JSONObject user = new JSONObject();
                user.put("id", rs.getInt("id"));
                user.put("username", rs.getString("username"));
                user.put("email", rs.getString("email"));
                user.put("created_at", rs.getTimestamp("created_at").toString());
                usersArray.put(user);
            }
            
            response.getWriter().write(usersArray.toString());
            
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
```

---

## 🔒 Security Recommendations

### Current Issues:
1. ❌ Passwords stored in **plain text** in LocalStorage
2. ❌ No server-side validation
3. ❌ Data only stored in browser (lost if cache cleared)
4. ❌ No admin authentication

### Recommended Improvements:
1. ✅ Use MySQL database instead of LocalStorage
2. ✅ Hash passwords using bcrypt or similar
3. ✅ Add admin authentication for user management
4. ✅ Implement server-side validation
5. ✅ Use HTTPS in production

---

## 📊 Quick Commands Reference

### Browser Console Commands:
```javascript
// View all users
localStorage.getItem('users')

// Count users
JSON.parse(localStorage.getItem('users')).length

// Find user by username
JSON.parse(localStorage.getItem('users')).find(u => u.username === 'john_doe')

// Export users to console
console.table(JSON.parse(localStorage.getItem('users')))

// Clear all users (⚠️ Warning: Deletes all data)
localStorage.removeItem('users')
```

### MySQL Commands:
```sql
-- View all users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- Recent registrations
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

-- Search by email domain
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Delete specific user
DELETE FROM users WHERE username = 'test_user';

-- Clear all users (⚠️ Warning)
TRUNCATE TABLE users;
```

---

## 📝 Summary

**Current Setup:** Users are stored in browser LocalStorage
**To View:** Use browser DevTools → Application → Local Storage → users key
**Recommended:** Migrate to MySQL database for production use
**Admin Page:** Create `admin.html` for easy user management

For production, always use a proper database with encrypted passwords!
