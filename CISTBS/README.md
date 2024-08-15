### Endpoints
GET /incidents/: Retrieve a list of all incidents.
POST /incidents/: Create a new incident.
GET /incidents/<int:pk>/: Retrieve details of a specific incident.
PUT /incidents/<int:pk>/: Update a specific incident.
DELETE /incidents/<int:pk>/: Delete a specific incident.


### Incident Fields
Incident name
Date of incident : dd/mm/yy
Incident Priority: Low/Medium/High - Established from the impact and/or risk to the business
Time incident occurred: 
Time incident was resolved
Incident type: Malware, etc.
Personnel involved: Names of the individuals involved in resolving the incident and their function(s), including any service providers
Incident impact: What impact did the incident have? I.e. loss of systems
Brief summary: What happened?
