from django.core.management.base import BaseCommand
from incidents.models import Playbook, Section, Step, UserAction, HelpDeskAction, ResourceLink
from incidents.models import IncidentType

class Command(BaseCommand):
    help = 'Load the complete ransomware playbook data into the database'

    def handle(self, *args, **options):
        # Step 1: Create IncidentType
        ransomware_type, created = IncidentType.objects.get_or_create(
            name="Ransomware",
            defaults={'description': "Incidents related to ransomware attacks"}
        )

        # Create Playbook
        playbook = Playbook.objects.create(
            title="Ransomware Playbook",
            incident_type=ransomware_type,
            description="A comprehensive guide on investigating, remediating, communicating, and recovering from ransomware incidents."
        )
        
        # Create Sections
        section_investigate = Section.objects.create(
            playbook=playbook,
            title="Investigate",
            order=1,
            content="""
                Investigate, remediate (contain, eradicate), and communicate in parallel! 
                Containment is critical in ransomware incidents, prioritize accordingly. Use your best judgment.

                1. **Determine the type** of ransomware (_i.e.,_ what is the family, variant, or flavor?)
                    - Find any related messages:
                        - graphical user interfaces (GUIs) for the malware itself
                        - text or html files, sometimes opened automatically after encryption
                        - image files, often as wallpaper on infected systems
                        - contact emails in encrypted file extensions
                        - pop-ups after trying to open an encrypted file
                        - voice messages
                    - Analyze the messages looking for clues to the ransomware type:
                        - ransomware name
                        - language, structure, phrases, artwork
                        - contact email
                        - format of the user id
                        - ransom demand specifics (_e.g._, digital currency, gift cards)
                        - payment address in case of digital currency
                        - support chat or support page
                    - Analyze affected and/or new files. Check:
                        - file renaming scheme of encrypted files including extension (_e.g._, `.crypt`, `.cry`, `.locked`) and base name
                        - file corruption vs encryption
                        - targeted file types and locations
                        - owning user/group of affected files
                        - icon for encrypted files
                        - file markers
                        - existence of file listings, key files or other data files
                    - Analyze affected software or system types:
                        - Some ransomware variants only affect certain tools (_e.g._, databases) or platforms (_e.g._, NAS products)
                    - Upload indicators to automated categorization services like [Crypto Sheriff](https://www.nomoreransom.org/crypto-sheriff.php), [ID Ransomware](https://id-ransomware.malwarehunterteam.com/), or similar.

                2. **Determine the scope:**
                    - Which systems are affected?
                        - Scan for concrete indicators of compromise (IOCs) such as files/hashes, processes, network connections, etc.
                        - Check similar systems for infection (_e.g._, similar users, groups, data, tools, department, configuration, patch status)
                        - Find external command and control (C2), if present, and find other systems connecting to it.
                    - What data is affected?
                        - Find anomalous changes to file metadata such as mass changes to creation or modification times.
                        - Find changes to normally-stable or critical data files.
                3. **Assess the impact** to prioritize and motivate resources
                    - Assess functional impact: impact to business or mission.
                    - Assess information impact: impact to confidentiality, integrity, and availability of data.
                4. **Find the infection vector.** 
                    - Common specifics and data sources include:
                        - email attachment
                        - insecure remote desktop protocol (RDP)
                        - self-propagation (worm or virus)
                        - infection via removable drives
                        - delivered by other malware or attacker tool
            """
        )

        section_remediate = Section.objects.create(
            playbook=playbook,
            title="Remediate",
            order=2,
            content="""
                Plan remediation events where these steps are launched together (or in coordinated fashion), with appropriate teams ready to respond to any disruption.
                Consider the timing and tradeoffs of remediation actions: your response has consequences.

                **Containment is critical in ransomware situations. Inform containment measures with facts from the investigation.**

                - Quarantine infected systems
                - Quarantine affected users and groups.
                - Quarantine file shares (not just known-infected shares; protect uninfected shares too)
                - Quarantine shared databases
                - Quarantine backups, if not already secured
                - Block command and control domains and addresses
                - Remove vector emails from inboxes
                - Confirm endpoint protection is up-to-date and enabled on all systems.
                - Confirm patches are deployed on all systems.
                - Deploy custom signatures to endpoint protection and network security tools based on discovered IOCs
                - Rebuild infected systems from known-good media
                - Restore from known-clean backups
                - Watch for re-infection
            """
        )

        section_communicate = Section.objects.create(
            playbook=playbook,
            title="Communicate",
            order=3,
            content="""
                Communicate effectively with all stakeholders, including leadership, users, customers, legal counsel, insurance providers, and law enforcement, based on the incident's severity.

                1. Escalate incident and communicate with leadership per procedure.
                2. Document incident per procedure.
                3. Communicate with internal and external legal counsel per procedure.
                4. Communicate with users (internal):
                    - Communicate incident response updates per procedure.
                    - Communicate impact of incident and incident response actions.
                    - Communicate requirements: "what should users do and not do?"
                5. Communicate with customers.
                6. Contact insurance provider(s).
                7. Communicate with regulators.
                8. Consider notifying and involving law enforcement.
                9. Communicate with security and IT vendors.
            """
        )

        section_recover = Section.objects.create(
            playbook=playbook,
            title="Recover",
            order=4,
            content="""
                Launch business continuity/disaster recovery plan(s) if compromise involved business outages.

                - Recover data from known-clean backups.
                - Find and try known decryptors for the variant(s) discovered using resources like the No More Ransom! Project's [Decryption Tools page](https://www.nomoreransom.org/en/decryption-tools.html).
                - Consider paying the ransom for irrecoverable critical assets/data, in accordance with policy.
            """
        )

        # Create Reference Links for the Playbook
        ResourceLink.objects.create(
            section=section_investigate,
            description="Crypto Sheriff: Upload files and identify the ransomware.",
            url="https://www.nomoreransom.org/crypto-sheriff.php"
        )

        ResourceLink.objects.create(
            section=section_investigate,
            description="ID Ransomware: Identify the ransomware variant.",
            url="https://id-ransomware.malwarehunterteam.com/"
        )

        ResourceLink.objects.create(
            section=section_remediate,
            description="No More Ransom! Project: Find known decryptors for ransomware.",
            url="https://www.nomoreransom.org/en/decryption-tools.html"
        )

        ResourceLink.objects.create(
            section=section_recover,
            description="Best Practices: What to do after a ransomware attack.",
            url="https://www.nomoreransom.org/en/ransomware-qa.html"
        )

        self.stdout.write(self.style.SUCCESS('Successfully loaded the complete ransomware playbook into the database.'))
