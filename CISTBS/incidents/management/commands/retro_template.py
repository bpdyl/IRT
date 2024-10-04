# templates.py

import json
from django.core.management.base import BaseCommand
from incidents.models import RetrospectiveTemplate

class Command(BaseCommand):
    help = 'Create Retrospective Templates'

    def handle(self, *args, **kwargs):
        template_name = "Default Retrospective Template"
        markdown_content = """
        # Incident Retrospective Report
            ---

            ### **Incident Summary**

            - **Date of Incident**: {{ incident.created_at | date:"%Y-%m-%d" }}
            - **Incident Title**: {{ incident.title }}
            - **Incident ID**: {{ incident.id }}
            - **Severity Level**: {{ incident.severity }}
            - **Incident Lead**: {{ incident.incident_lead }}

            ---

            ### **1. Lead-Up to the Incident**

            #### **Background Information**

            Provide context about the systems, services, or components involved in the incident. Include any relevant history, previous incidents, or known issues.

            #### **Timeline of Events Prior to the Incident**

            - **[Timestamp]**: Describe key events leading up to the incident.
            - **[Timestamp]**: Note any changes, deployments, or anomalies observed.

            ---

            ### **2. What Happened**

            #### **Incident Description**

            Provide a detailed account of what occurred during the incident. Explain the sequence of events and how the incident unfolded.

            #### **Detection**

            - **Method of Detection**: Describe how the incident was initially detected (e.g., monitoring alerts, user reports).
            - **First Responder**: Identify who first noticed the incident.

            ---

            ### **3. Impact Analysis**

            #### **Affected Services and Components**

            List all services, systems, or components that were impacted by the incident.

            #### **User Impact**

            Describe how end-users were affected, including:

            - Number of users impacted
            - Type of impact (e.g., downtime, data loss, degraded performance)

            #### **Business Impact**

            Explain the incident's effect on business operations, such as:

            - Financial losses
            - Reputational damage
            - Compliance or legal implications

            ---

            ### **4. Root Cause Analysis**

            #### **Immediate Cause**

            Identify the direct cause of the incident.

            #### **Contributing Factors**

            List any secondary factors that contributed to the incident.

            #### **Root Cause**

            Conduct a detailed analysis to uncover the underlying root cause. Consider using techniques like the **5 Whys**:

            1. **Why did X happen?**
            2. **Why did Y happen?**
            3. Continue asking "why" until you reach the fundamental cause.

            ---

            ### **5. Mitigation and Resolution**

            #### **Mitigation Steps**

            Describe the immediate actions taken to mitigate the incident's impact.

            - **[Timestamp]**: Action taken and by whom.
            - Assess the effectiveness of each action.

            #### **Resolution Steps**

            Detail the steps taken to fully resolve the incident.

            - Outline challenges faced during the resolution process.
            - Mention any workarounds or temporary fixes applied.

            #### **Time to Mitigate and Resolve**

            - **Time to Mitigate**: [Duration]
            - **Time to Resolve**: [Duration]

            ---

            ### **6. Lessons Learned**

            #### **What Went Well**

            Highlight successful aspects of the incident response, such as:

            - Effective teamwork
            - Useful tools or processes
            - Quick detection and response times

            #### **What Could Have Gone Better**

            Discuss areas for improvement, including:

            - Delays in detection or response
            - Communication gaps
            - Procedural inefficiencies

            #### **Additional Insights**

            Share any other observations or insights gained during the incident.

            ---

            ### **7. Preventative Measures**

            #### **Immediate Actions**

            List short-term actions to prevent recurrence, including:

            - **Action Item**: Description
            - **Owner**: Assigned individual
            - **Deadline**: Due date

            #### **Long-Term Strategies**

            Propose long-term solutions, such as:

            - Process improvements
            - System upgrades
            - Training programs

            ---

            ### **8. Action Items**

            Provide a consolidated list of follow-up tasks:

            - **Task**: Description
            - **Owner**: Assigned individual
            - **Priority**: High/Medium/Low
            - **Due Date**: Deadline

            ---

            ### **9. Communication and Collaboration**

            #### **Internal Communication**

            Evaluate the effectiveness of internal communication during the incident.

            - **Strengths**: What worked well.
            - **Weaknesses**: Areas needing improvement.

            #### **External Communication**

            Assess how communication with customers or external stakeholders was handled.

            - **Feedback Received**: Summarize any feedback.
            - **Improvements Needed**: Suggest enhancements.

            ---

            ### **10. Appendices**

            #### **Supporting Data**

            Include relevant logs, charts, or screenshots that support the analysis.

            #### **Reference Materials**

            - Links to related documentation
            - Previous incident reports
            - Monitoring dashboards

            ---

            **Sign-Off**

            - **Prepared By**: [Your Name]
            - **Date**: [Date of Completion]
            - **Reviewed By**: [Reviewer Name]
            - **Approved By**: [Approver Name]

            ---

        """

        # Convert Markdown to HTML
        import markdown
        html_content = markdown.markdown(markdown_content)

        # Now, convert HTML to Delta
        # Since we cannot run JavaScript in Python directly, you may consider using a library like 'quill-delta' in Node.js to perform this conversion
        # Alternatively, you can store the HTML content instead of Delta

        # For simplicity, let's store the HTML content
        RetrospectiveTemplate.objects.create(
            name=template_name,
            content=html_content
        )
