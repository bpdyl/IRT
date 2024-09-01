from django.core.management.base import BaseCommand
from django.utils import timezone
from incidents.models import Playbook
from incidents.models import IncidentType, Incident, Investigation, Remediation, Communication, Recovery, Reference, CustomUser

class Command(BaseCommand):
    help = 'Populates the database with phishing playbook data and an example incident'

    def handle(self, *args, **kwargs):
        # Assume the user creating the incident
        #get the first user
        reporter = CustomUser.objects.first()  

        # Step 1: Create IncidentType
        phishing_type, created = IncidentType.objects.get_or_create(
            name="Phishing",
            defaults={'description': "Incidents related to phishing attacks"}
        )
        phishing_playbook = Playbook.objects.get(title="Phishing Playbook")
        phishing_incident, created = Incident.objects.get_or_create(
            incident_type=phishing_type,
            title="Phishing Attack on Corporate Email",
            defaults={
                'description': "A phishing attack has been identified targeting corporate email users.",
                'reported_by': reporter,
                'status': "Identified",
                'severity': "High",
                'initial_entry_point': "Email",
                'start_datetime': timezone.now(),
                'playbook': phishing_playbook
            }
        )

        # Example Investigation linked to the Incident
        Investigation.objects.get_or_create(
            incident=phishing_incident,
            scope="Scope the attack and understand the extent of the phishing incident.",
            defaults={
                'total_impacted_users': 5,  # Placeholder value
                'user_actions': "Determine if users downloaded attachments or visited spoofed sites.",
                'related_activities': "Check social media and any possibly suspicious emails.",
                'message_analysis': {
                    "recipient": "example@domain.com",
                    "sender": "phisher@domain.com",
                    "subject": "Urgent: Update your account information"
                },
                'link_attachment_analysis': {
                    "nslookup": "example IP",
                    "whois": "example registration info"
                },
                'attack_type': "Credential Harvesting",
                'severity_assessment': "High risk of credential compromise.",
                'investigator': reporter,
                'investigation_date': timezone.now()
            }
        )

        # Create Remediation, Communication, Recovery, and References as needed
        Remediation.objects.get_or_create(
            incident=phishing_incident,
            containment_steps="Change login credentials, block malicious domains.",
            defaults={
                'tools_used': {"VirusTotal": "Used for link and attachment analysis", "Cuckoo Sandbox": "Used for malware analysis"},
                'account_actions': "Change login credentials and reduce access to critical services.",
                'blocking_actions': "Block messages with similar senders and URLs.",
                'forensic_actions': "Retain forensic copies of all suspicious emails.",
                'purge_actions': "Purge related messages from other user inboxes.",
                'mobile_containment': "Consider wiping affected mobile devices.",
                'monitoring_actions': "Increase detection alert level with enhanced monitoring.",
                'assistance': "Engage with external security consultants for further investigation.",
                'software_upgrades': "Ensure all anti-malware software is up to date.",
                'remediator': reporter,
                'remediation_date': timezone.now()
            }
        )

        Communication.objects.get_or_create(
            incident=phishing_incident,
            leadership_communication="Notify senior leadership about the phishing incident and the response plan.",
            defaults={
                'documentation': "Document all steps taken during the investigation and remediation.",
                'legal_communication': "Discuss potential compliance and risk exposure with legal counsel.",
                'user_communication': "Inform users about the phishing attack and precautions to take.",
                'customer_communication': "Notify customers whose data may be at risk.",
                'insurance_communication': "Contact insurance provider to discuss coverage and claim process.",
                'law_enforcement_communication': "Consider notifying law enforcement based on severity.",
                'vendor_communication': "Engage with security vendors for additional support.",
                'communicator': reporter,
                'communication_date': timezone.now()
            }
        )

        Recovery.objects.get_or_create(
            incident=phishing_incident,
            recovery_plan="Implement business continuity plan and begin recovery operations.",
            defaults={
                'training_reinforcement': "Reinforce phishing awareness training across the organization.",
                'it_security_staff_update': "Update IT and security staff on the latest phishing techniques.",
                'control_failures': "Review and rectify any control failures identified during the incident.",
                'additional_resources': "Allocate additional resources for incident recovery as needed.",
                'recovery_lead': reporter,
                'recovery_date': timezone.now()
            }
        )

        Reference.objects.get_or_create(
            reference_type="ExternalResources",
            title="Anti-Phishing Attack resources",
            defaults={'url': "https://resources.infosecinstitute.com/category/enterprise/phishing/phishing-countermeasures/top-16-anti-phishing-resources/#gref"},
            incident=phishing_incident
        )

        Reference.objects.get_or_create(
            reference_type="ExternalResources",
            title="Methods of Identifying a Phishing attack",
            defaults={'url': "https://www.securitymetrics.com/blog/7-ways-recognize-phishing-email"},
            incident=phishing_incident
        )

        Reference.objects.get_or_create(
            reference_type="ExternalResources",
            title="Phishing Email Examples",
            defaults={'url': "https://www.phishing.org/phishing-examples"},
            incident=phishing_incident
        )

        Reference.objects.get_or_create(
            reference_type="ExternalResources",
            title="Anti-Phishing best practices",
            defaults={'url': "https://resources.infosecinstitute.com/category/enterprise/phishing/phishing-countermeasures/anti-phishing-best-practices/#gref"},
            incident=phishing_incident
        )

        self.stdout.write(self.style.SUCCESS('Phishing playbook and example incident data inserted successfully.'))