import streamlit as st
import requests
import json

# ============================================================
# Configuration
# ============================================================

API_URL = "http://127.0.0.1:8000"

st.set_page_config(
    page_title="Diabetes Risk & Management Platform",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============================================================
# Session State
# ============================================================

if "token" not in st.session_state:
    st.session_state.token = None
if "user" not in st.session_state:
    st.session_state.user = None

# ============================================================
# API Helpers
# ============================================================

def api_post(endpoint: str, data: dict, auth: bool = False) -> dict:
    headers = {"Content-Type": "application/json"}
    if auth and st.session_state.token:
        headers["Authorization"] = f"Bearer {st.session_state.token}"
    response = requests.post(f"{API_URL}{endpoint}", 
                             json=data, headers=headers)
    return response

def api_get(endpoint: str) -> dict:
    headers = {}
    if st.session_state.token:
        headers["Authorization"] = f"Bearer {st.session_state.token}"
    response = requests.get(f"{API_URL}{endpoint}", headers=headers)
    return response

def api_login(email: str, password: str):
    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    return response

# ============================================================
# Sidebar
# ============================================================

with st.sidebar:
    st.title("Diabetes Platform")

    st.divider()

    # Auth state
    if st.session_state.token:
        st.success(f"Logged in as {st.session_state.user['full_name']}")
        if st.button("Logout", use_container_width=True):
            st.session_state.token = None
            st.session_state.user = None
            st.rerun()

        st.divider()
        page = st.radio("Navigate", [
            "Risk Assessment",
            "Dashboard",
            "Log Reading",
            "Medications",
            "Reports"
        ])
    else:
        page = st.radio("Navigate", ["Risk Assessment", "Login / Register"])

# ============================================================
# Pages
# ============================================================

if page == "Login / Register":
    st.title("Login or Register")
    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        st.subheader("Login")
        email = st.text_input("Email", key="login_email")
        password = st.text_input("Password", type="password", key="login_pass")
        if st.button("Login", use_container_width=True):
            res = api_login(email, password)
            if res.status_code == 200:
                st.session_state.token = res.json()["access_token"]
                user_res = api_get("/auth/me")
                st.session_state.user = user_res.json()
                st.success("Logged in successfully.")
                st.rerun()
            else:
                st.error("Invalid email or password.")

    with tab2:
        st.subheader("Create Account")
        full_name = st.text_input("Full Name")
        reg_email = st.text_input("Email", key="reg_email")
        reg_password = st.text_input("Password", type="password", key="reg_pass")
        is_patient = st.checkbox("I am a diabetes patient")
        if st.button("Register", use_container_width=True):
            res = api_post("/auth/register", {
                "email": reg_email,
                "full_name": full_name,
                "password": reg_password,
                "is_patient": is_patient
            })
            if res.status_code == 200:
                st.success("Account created. Please login.")
            else:
                st.error(res.json().get("detail", "Registration failed."))

elif page == "Risk Assessment":
    st.title("Diabetes Risk Assessment")

    if not st.session_state.token:
        st.info("Enter your health metrics below to get your risk score. Create an account to save results and access full management features.")

    st.subheader("Enter Your Health Information")

    col1, col2 = st.columns(2)

    with col1:
        age = st.number_input("Age", min_value=1, max_value=120, value=40)
        gender = st.selectbox("Gender", ["Male", "Female"])
        bmi = st.number_input("BMI", min_value=10.0, max_value=80.0, value=25.0)
        high_bp = st.selectbox("Do you have High Blood Pressure?", ["No", "Yes"])
        high_chol = st.selectbox("Do you have High Cholesterol?", ["No", "Yes"])

    with col2:
        smoker = st.selectbox("Do you smoke?", ["No", "Yes"])
        physically_active = st.selectbox("Are you physically active?", ["Yes", "No"])
        polyuria = st.selectbox("Do you experience excessive urination?", ["No", "Yes"])
        polydipsia = st.selectbox("Do you experience excessive thirst?", ["No", "Yes"])
        sudden_weight_loss = st.selectbox("Have you had sudden weight loss?", ["No", "Yes"])

    def yn(val): return 1.0 if val == "Yes" else 0.0

    if st.button("Assess My Risk", use_container_width=True, type="primary"):
        payload = {
            "age": age,
            "gender": 1.0 if gender == "Male" else 0.0,
            "bmi": bmi,
            "high_bp": yn(high_bp),
            "high_cholesterol": yn(high_chol),
            "smoker": yn(smoker),
            "physically_active": yn(physically_active),
            "polyuria": yn(polyuria),
            "polydipsia": yn(polydipsia),
            "sudden_weight_loss": yn(sudden_weight_loss)
        }

        if st.session_state.token:
            res = api_post("/risk/assess", payload, auth=True)
        else:
            # For unauthenticated users, call a public endpoint
            res = api_post("/risk/assess-public", payload, auth=False)

        if res.status_code == 200:
            result = res.json()
            st.divider()
            st.subheader("Your Risk Assessment Results")

            col1, col2, col3 = st.columns(3)
            with col1:
                risk_class = f"risk-{result['risk_label']}"
                st.markdown(f"<div class='{risk_class}'>{result['risk_percentage']}%</div>", 
                           unsafe_allow_html=True)
                st.caption("Risk Score")
            with col2:
                label_colors = {"low": "green", "moderate": "orange", "high": "red"}
                st.markdown(f"**Risk Level:** :{label_colors[result['risk_label']]}[{result['risk_label'].upper()}]")
            with col3:
                st.metric("Risk Score", f"{result['risk_score']:.3f}")

            st.info(result['interpretation'])
            st.caption(result['disclaimer'])

            # Feature contributions chart
            st.subheader("What's Contributing to Your Score")
            import pandas as pd
            contrib_df = pd.DataFrame([
                {"Feature": k.replace("_", " ").title(), "Impact": v}
                for k, v in result['feature_contributions'].items()
            ]).sort_values("Impact", ascending=True)

            import plotly.express as px
            fig = px.bar(contrib_df, x="Impact", y="Feature", 
                        orientation='h',
                        color="Impact",
                        color_continuous_scale=["green", "yellow", "red"],
                        title="Feature Contributions (SHAP Values)")
            st.plotly_chart(fig, use_container_width=True)

            if not st.session_state.token:
                st.divider()
                st.subheader("Want to track and manage your health?")
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.markdown("**Track Glucose**\nLog daily readings and detect dangerous episodes automatically.")
                with col2:
                    st.markdown("**Manage Medications**\nSet schedules, track adherence, never miss a dose.")
                with col3:
                    st.markdown("**Export Reports**\nGenerate clinical PDF reports to share with your doctor.")
                st.button("Create Free Account", use_container_width=True, type="primary")
        else:
            st.error("Could not assess risk. Please try again.")

elif page == "Dashboard":
    st.title("Patient Dashboard")
    st.write("Token:", st.session_state.token) #temporary debug line
    glucose_res = api_get("/patient/glucose?limit=30")
    episodes_res = api_get("/patient/episodes?limit=5")

    if glucose_res.status_code == 200:
        logs = glucose_res.json()
        if logs:
            import pandas as pd
            import plotly.express as px

            df = pd.DataFrame(logs)
            df['logged_at'] = pd.to_datetime(df['logged_at'])

            # Summary metrics
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Latest Reading", f"{df.iloc[0]['glucose_value']} mg/dL")
            with col2:
                st.metric("Average (30 days)", f"{df['glucose_value'].mean():.1f} mg/dL")
            with col3:
                st.metric("Highest", f"{df['glucose_value'].max()} mg/dL")
            with col4:
                st.metric("Lowest", f"{df['glucose_value'].min()} mg/dL")

            st.divider()

            # Glucose trend
            st.subheader("Glucose Trend")
            fig = px.line(df.sort_values('logged_at'), 
                         x='logged_at', y='glucose_value',
                         title='Blood Glucose Over Time')
            fig.add_hline(y=180, line_dash="dash", 
                         line_color="red", annotation_text="High threshold")
            fig.add_hline(y=70, line_dash="dash",
                         line_color="orange", annotation_text="Low threshold")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No glucose readings yet. Start by logging a reading.")
    else:
        st.warning("Could not load glucose data. Make sure your patient profile is set up.")

    # Recent episodes
    if episodes_res.status_code == 200:
        episodes = episodes_res.json()
        if episodes:
            st.subheader("Recent Episodes")
            for ep in episodes:
                color = "red" if ep['episode_type'] == 'hyperglycemia' else "orange"
                st.markdown(f":{color}[**{ep['episode_type'].upper()}**] — {ep['glucose_value']} mg/dL — {ep['severity']} severity — {ep['occurred_at'][:10]}")

elif page == "Log Reading":
    st.title("Log Glucose Reading")

    col1, col2 = st.columns(2)
    with col1:
        glucose_val = st.number_input("Glucose Value (mg/dL)", 
                                       min_value=20.0, max_value=600.0, value=100.0)
        context = st.selectbox("Reading Context", 
                               ["fasting", "pre_meal", "post_meal", "random", "bedtime"])
    with col2:
        from datetime import datetime
        logged_at = st.date_input("Date")
        logged_time = st.time_input("Time")
        notes = st.text_area("Notes (optional)")

    if st.button("Log Reading", use_container_width=True, type="primary"):
        logged_datetime = datetime.combine(logged_at, logged_time).isoformat()
        res = api_post("/patient/glucose", {
            "glucose_value": glucose_val,
            "context": context,
            "notes": notes,
            "logged_at": logged_datetime
        }, auth=True)

        if res.status_code == 200:
            result = res.json()
            st.success(f"Reading logged: {glucose_val} mg/dL")
            if result.get('episode'):
                ep = result['episode']
                st.error(f"Episode detected: {ep['episode_type'].upper()} — {ep['severity']} severity. Please take appropriate action.")
        else:
            st.error("Failed to log reading.")

elif page == "Medications":
    st.title("Medications")

    tab1, tab2, tab3 = st.tabs(["Current Medications", "Add Medication", "Adherence"])

    with tab1:
        res = api_get("/patient/medications")
        if res.status_code == 200:
            meds = res.json()
            if meds:
                for med in meds:
                    col1, col2, col3 = st.columns([3, 2, 1])
                    with col1:
                        st.markdown(f"**{med['name']}** — {med['dosage']}")
                        st.caption(f"{med['frequency']} | Scheduled: {med['scheduled_time']} | Prescribed by: {med['prescribed_by']}")
                    with col2:
                        taken_time = st.time_input(
                            "Taken at",
                            key=f"time_{med['id']}"
                        )
                    with col3:
                        if st.button("Mark Taken", key=f"taken_{med['id']}",
                                     use_container_width=True, type="primary"):
                            from datetime import datetime, date
                            taken_datetime = datetime.combine(
                                date.today(), taken_time
                            ).isoformat()
                            res = api_post("/patient/adherence", {
                                "medication_id": med['id'],
                                "scheduled_time": taken_datetime,
                                "taken_at": taken_datetime,
                                "was_taken": True
                            }, auth=True)
                            if res.status_code == 200:
                                st.success(f"{med['name']} marked as taken.")
                            else:
                                st.error("Failed to log adherence.")
                    st.divider()
            else:
                st.info("No medications added yet.")
        else:
            st.warning("Could not load medications. Make sure your patient profile is set up.")

    with tab2:
        st.subheader("Add New Medication")
        med_name = st.text_input("Medication Name")
        med_dosage = st.text_input("Dosage (e.g. 500mg)")
        med_frequency = st.selectbox("Frequency", 
                                      ["once daily", "twice daily", 
                                       "three times daily", "as needed"])
        med_time = st.text_input("Scheduled Times (e.g. 08:00,20:00)")
        med_doctor = st.text_input("Prescribed By")

        if st.button("Add Medication", use_container_width=True, type="primary"):
            res = api_post("/patient/medications", {
                "name": med_name,
                "dosage": med_dosage,
                "frequency": med_frequency,
                "scheduled_time": med_time,
                "prescribed_by": med_doctor
            }, auth=True)
            if res.status_code == 200:
                st.success(f"{med_name} added successfully.")
            else:
                st.error("Failed to add medication.")

    with tab3:
        res = api_get("/patient/adherence/summary")
        if res.status_code == 200:
            summary = res.json()
            if summary:
                for med_name, data in summary.items():
                    st.metric(
                        med_name,
                        f"{data['adherence_rate']}%",
                        f"{data['taken']}/{data['total_scheduled']} doses taken"
                    )
            else:
                st.info("No adherence data yet.")

elif page == "Reports":
    st.title("Reports")
    st.subheader("Generate Clinical Report")

    col1, col2 = st.columns(2)
    with col1:
        days = st.selectbox("Report Period", [7, 14, 30, 60, 90], index=2)
    with col2:
        st.write("")
        st.write("")
        if st.button("Generate PDF Report", use_container_width=True, type="primary"):
            with st.spinner("Generating your report..."):
                res = api_get(f"/patient/report?days={days}")
                if res.status_code == 200:
                    st.download_button(
                        label="Download Report PDF",
                        data=res.content,
                        file_name=f"diabetes_report_{days}days.pdf",
                        mime="application/pdf",
                        use_container_width=True
                    )
                    st.success("Report generated successfully.")
                else:
                    st.error("Failed to generate report.")

    st.divider()
    st.markdown("""
    **What's included in the report:**
    - Patient information and clinical targets
    - Glucose summary — average, time in range, estimated HbA1c
    - Recent glucose readings table
    - Detected hypo/hyperglycemic episodes
    - Medication list with adherence rates
    - Clinical disclaimer
    """)
    st.caption("Reports are designed to be shared with your healthcare provider.")