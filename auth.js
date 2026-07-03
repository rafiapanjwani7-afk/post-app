import supabase from "./supabase.js";

// ================= SIGNUP =================

const signupForm = document.getElementById('signupForm')

if (signupForm) {
    signupForm.addEventListener('submit', signup)
}

async function signup(event) {
    event.preventDefault()

    const name = document.getElementById('signName').value.trim()
    const email = document.getElementById('signEmail').value.trim()
    const password = document.getElementById('signPassword').value

    if (!name || !email || !password) {
        Swal.fire('Error', 'Please fill in all fields!', 'error')
        return
    }

    // basic client-side checks
    if (password.length < 6) {
        Swal.fire('Weak password', 'Password should be at least 6 characters.', 'warning')
        return
    }
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRe.test(email)) {
        Swal.fire('Invalid email', 'Please enter a valid email address.', 'error')
        return
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]')
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name
            }
        }
    })

    if (error) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
        Swal.fire('Error', error.message, 'error')
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        timer: 1200,
        confirmButtonText: 'Proceed to Login',
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'dashboard.html'
    })
}

// ================= LOGIN =================

const loginForm = document.getElementById('loginForm')

if (loginForm) {
    loginForm.addEventListener('submit', login)
}

async function login(event) {
    event.preventDefault()

    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value

    if (!email || !password) {
        Swal.fire('Error', 'Please fill in all fields!', 'error')
        return
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]')
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
        Swal.fire('Error', error.message, 'error')
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 900,
        confirmButtonText: 'Proceed to Dashboard',
        showConfirmButton: false
    })
    .then(() => {
        window.location.href = 'dashboard.html'
    })
}


// ================= LOGOUT =================

async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        Swal.fire('Error', error.message, 'error')
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Logged Out'
    })
    .then(() => {
        window.location.href = 'index.html'
    })
}

// ================= AUTH STATE =================

supabase.auth.onAuthStateChange((event, session) => {
    console.log('Event:', event)
    console.log('Session:', session)

    if (event === 'SIGNED_IN') {
        console.log('User:', session?.user?.email)
    // Swal.fire({
    //     icon: 'success',
    //     title: 'Welcome Back!',
    // })
    // location.href = 'dashboard.html'
}

    if (event === 'SIGNED_OUT') {
        console.log('User logged out')
    }
})

// Make functions available globally if needed
window.signup = signup
window.login = login
window.logout = logout

export { supabase }