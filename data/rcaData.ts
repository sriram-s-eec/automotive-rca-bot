
import type { RcaEntry } from '../types';

export const rcaDataset: RcaEntry[] = [
    {
        id: 1,
        title: "CNC Milling Machine Spindle Vibration",
        machine_type: "CNC Milling Machine",
        symptoms: ["Excessive noise from spindle", "Poor surface finish on parts", "Vibration warnings on HMI", "Overheating spindle housing"],
        probable_root_causes: ["Unbalanced tool holder", "Worn spindle bearings", "Incorrect cutting parameters (speed/feed)", "Loose machine leveling"],
        recommended_actions: [
            "SAFETY FIRST: Ensure machine is in maintenance mode with lockout/tagout engaged.",
            "Inspect and clean the tool holder and spindle taper. Re-seat the tool.",
            "Run spindle without a tool to check for unloaded vibration (by qualified personnel).",
            "Review and adjust cutting parameters in the CNC program to match material and tool.",
            "Check machine leveling and foundation for any shifts.",
            "If vibration persists, schedule a spindle bearing inspection by a qualified technician.",
            "Use a vibration analyzer to pinpoint the source frequency."
        ],
        severity: "High",
        likely_frequency: "Occasional",
        keywords: "cnc, mill, spindle, vibration, noise, chatter, bad finish",
        example_user_phrases: ["My CNC machine is vibrating loudly.", "The mill is leaving a bad surface finish.", "Spindle has high vibration."],
        notes: "Consider using a laser tool balancer for high-speed machining applications."
    },
    {
        id: 2,
        title: "Robotic Welder Wire Feed Failure",
        machine_type: "Robotic Welder",
        symptoms: ["Inconsistent or 'bird-nesting' wire", "Weld porosity", "Robot halts with wire feed error", "Audible clicking from wire feeder"],
        probable_root_causes: ["Clogged or worn contact tip", "Incorrect drive roll tension", "Kinked or worn liner", "Wrong drive rolls for wire type/size"],
        recommended_actions: [
            "Ensure the robot is stopped and welding power source is off.",
            "Inspect and replace the contact tip if worn or clogged.",
            "Check and adjust drive roll tension. It should be tight enough to feed, but not deform the wire.",
            "Examine the liner for kinks or metal shavings. Purge with compressed air or replace if necessary.",
            "Verify the drive rolls match the wire diameter and type (e.g., V-groove for solid wire).",
            "Check the wire spool for tangles and ensure it rotates freely."
        ],
        severity: "Medium",
        likely_frequency: "Frequent",
        keywords: "robot, welder, wire feed, bird nest, porosity, inconsistent weld",
        example_user_phrases: ["The welding robot wire is jamming.", "My robotic welder stopped with a feed error.", "The wire feed is inconsistent on the welder."],
    },
    {
        id: 3,
        title: "Paint Booth Airflow Fault",
        machine_type: "Paint Booth",
        symptoms: ["'Orange peel' texture in paint finish", "Overspray settling on parts", "Air pressure alarms on control panel", "Solvent smell outside the booth"],
        probable_root_causes: ["Clogged intake or exhaust filters", "Fan motor failure or incorrect speed", "Improperly balanced booth pressure", "Leaking door seals"],
        recommended_actions: [
            "Wear appropriate PPE (respirator, gloves) before entering the booth.",
            "Check and replace all intake and exhaust filters. This is the most common cause.",
            "Verify the fan motor is running and belts (if present) are tensioned correctly.",
            "Use a manometer to check the booth's differential pressure against specifications.",
            "Inspect all door and opening seals for leaks or damage.",
            "Ensure the VFD (Variable Frequency Drive) for the fan motor is programmed correctly (qualified personnel only)."
        ],
        severity: "High",
        likely_frequency: "Occasional",
        keywords: "paint booth, airflow, orange peel, overspray, pressure fault",
        example_user_phrases: ["Paint finish is coming out with orange peel.", "There's a low airflow alarm on the paint booth.", "I have a lot of dust in my paint job."],
        notes: "Regularly log filter replacement dates and booth pressure readings to predict failures."
    },
    {
        id: 4,
        title: "Hydraulic Press Slow Operation",
        machine_type: "Hydraulic Press",
        symptoms: ["Cycle time is longer than usual", "Press struggles to reach full pressure", "Whining or groaning noise from pump", "Hydraulic fluid is overheating"],
        probable_root_causes: ["Internal pump leakage (worn vanes/pistons)", "Clogged hydraulic filter or suction strainer", "Pressure relief valve set too low or stuck open", "Low hydraulic fluid level or aerated fluid"],
        recommended_actions: [
            "LOCKOUT/TAGOUT the press before any inspection.",
            "Check hydraulic fluid level in the reservoir. Top up if necessary.",
            "Inspect the fluid for signs of aeration (foam) or contamination.",
            "Check the hydraulic filter indicator. Replace the filter if it's in the red zone.",
            "Listen to the pump for unusual cavitation noises (indicates air or starvation).",
            "Have a qualified technician check the pressure relief valve setting and pump performance.",
            "Take an oil sample for analysis to check for viscosity breakdown and contaminants."
        ],
        severity: "Critical",
        likely_frequency: "Occasional",
        keywords: "hydraulic press, slow, low pressure, overheating fluid, pump noise",
        example_user_phrases: ["The stamping press is running slow.", "My hydraulic press won't build pressure.", "The hydraulic pump is making a whining noise."],
    },
    {
        id: 5,
        title: "Conveyor Belt Mistracking",
        machine_type: "Conveyor System",
        symptoms: ["Belt is rubbing against the frame", "Frayed or damaged belt edges", "Uneven wear on the belt surface", "Material spillage"],
        probable_root_causes: ["Seized or misaligned rollers/idlers", "Improper belt tension (too loose or too tight)", "Uneven loading of material", "Material buildup on rollers"],
        recommended_actions: [
            "LOCKOUT/TAGOUT the conveyor system before approaching.",
            "Observe the belt path from a safe distance to identify where it starts to drift.",
            "Check for and clean any material buildup on the drive and tail pulleys and return idlers.",
            "Inspect all carrying and return idlers to ensure they spin freely. Replace any seized idlers.",
            "Verify belt tension. Adjust tensioners as needed to ensure proper grip without over-stretching.",
            "If the problem persists, perform a full roller alignment procedure as per the manufacturer's guide."
        ],
        severity: "Medium",
        likely_frequency: "Frequent",
        keywords: "conveyor, belt, mistracking, drift, rubbing, alignment",
        example_user_phrases: ["The conveyor belt is running to one side.", "My conveyor belt edges are getting damaged.", "Material is falling off the conveyor belt."],
    }
];
