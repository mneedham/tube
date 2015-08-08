import xml.etree.ElementTree as ET

tree = ET.parse('timetable/tfl_1-NTN_-550101-y05.xml')
root = tree.getroot()

ns = {'tx': 'http://www.transxchange.org.uk/'}
tube_stops = {}
for stop_points in root.findall("tx:StopPoints", ns):
    for stop_point in stop_points:
        id = stop_point.find("tx:AtcoCode", ns).text
        name = stop_point.find("tx:Descriptor/tx:CommonName", ns).text
        tube_stops[id] = name

for route_sections in root.findall("tx:RouteSections", ns):
    for route_section in route_sections.findall("tx:RouteSection", ns):
        id = route_section.get("id")
        print id
        for route_link in route_section.findall("tx:RouteLink", ns):
            from_station = route_link.find("tx:From/tx:StopPointRef", ns).text
            to_station = route_link.find("tx:To/tx:StopPointRef", ns).text
            print "%s -> %s" %(tube_stops[from_station], tube_stops[to_station])

# Morden -> High Barnet (via Charing Cross)
route_section_id = "RS_1-NTN-_-y05-550101-O-1"
route_section_id = "RS_1-NTN-_-y05-550101-I-40"

route_id = [ route.get("id")
             for route in root.find("tx:Routes", ns).findall("tx:Route", ns)
             if route.find("tx:RouteSectionRef", ns).text == route_section_id
           ][0]

journey_pattern_references = [
  journey_pattern.get("id")
  for journey_pattern in root.find("tx:Services", ns) \
                             .find("tx:Service", ns) \
                             .find("tx:StandardService", ns) \
                             .findall("tx:JourneyPattern", ns)
  if journey_pattern.find("tx:RouteRef", ns).text == route_id
]

[   journey.find("tx:DepartureTime", ns).text
    for journey in
    root.find("tx:VehicleJourneys", ns) \
        .findall("tx:VehicleJourney", ns)
    if journey.find("tx:JourneyPatternRef", ns).text in journey_pattern_references
]
