import { Server, Shield, Laptop, Network, Headphones, Settings, FileText, CheckCircle, Truck, Wrench, BarChart, Users } from "lucide-react"

export interface ServiceProcessStep {
    title: string
    description: string
}

export interface ServiceData {
    id: string
    title: string
    shortDescription: string
    fullDescription: string
    icon: any
    process: ServiceProcessStep[]
    benefits: string[]
}

export const servicesData: ServiceData[] = [
    {
        id: "it-infrastructure-procurement",
        title: "IT Infrastructure Procurement",
        shortDescription: "Strategic sourcing of enterprise-grade hardware including servers, networking gear, and end-user devices.",
        fullDescription: "We simplify the complex process of IT procurement by acting as your single point of contact for all hardware needs. Our established partnerships with global OEMs allow us to negotiate the best prices and ensuring you get enterprise-grade equipment that matches your specific business requirements. From high-performance servers to employee workstations, we handle everything from sourcing to logistics.",
        icon: Server,
        process: [
            {
                title: "Needs Assessment",
                description: "We conduct a thorough audit of your current infrastructure and discuss your growth plans to identify the exact hardware specifications required."
            },
            {
                title: "Vendor Selection & Negotiation",
                description: "Leveraging our partnerships with Dell, HP, Lenovo, and Cisco, we solicit bids and negotiate competitive pricing on your behalf."
            },
            {
                title: "Order Management",
                description: "We handle all ordering logistics, tracking, and vendor communications to ensure timely delivery of equipment."
            },
            {
                title: "Logistics & Delivery",
                description: "Coordinating secure shipping and handling to your multiple office locations or remote workforce."
            },
            {
                title: "Asset Tagging & Documentation",
                description: "Before deployment, all assets are tagged, cataloged, and entered into your asset management system for complete visibility."
            }
        ],
        benefits: [
            "Cost savings through bulk purchasing power",
            "Access to latest enterprise technology",
            "Streamlined vendor management",
            "Reduced procurement cycle time"
        ]
    },
    {
        id: "network-server-setup",
        title: "Network & Server Setup",
        shortDescription: "Design and deployment of robust, scalable network architectures and server environments.",
        fullDescription: "A reliable network is the backbone of modern business. Our team designs and deploys secure, high-speed network infrastructures tailored to your office layout and data requirements. We handle everything from structured cabling and server rack installation to configuring firewalls and switches, ensuring maximum uptime and security.",
        icon: Network,
        process: [
            {
                title: "Site Survey & Planning",
                description: "We visit your facility to map out cable runs, access point locations, and server room requirements."
            },
            {
                title: "Architecture Design",
                description: "Our engineers design a secure network topology including VLANs, subnets, and redundancy plans."
            },
            {
                title: "Hardware Installation",
                description: "Physical installation of server racks, switches, routers, and structured cabling."
            },
            {
                title: "Configuration & Security Hardening",
                description: "Setting up firewalls, VPNs, and access controls to secure your internal network from external threats."
            },
            {
                title: "Performance Testing",
                description: "Rigorous stress testing to ensure the network can handle peak traffic loads without latency."
            }
        ],
        benefits: [
            "High-availability network architecture",
            "Enhanced data security and compliance",
            "Scalable infrastructure for future growth",
            "Optimized performance for cloud applications"
        ]
    },
    {
        id: "end-user-device-management",
        title: "End-User Device Management",
        shortDescription: "Comprehensive lifecycle management for laptops, desktops, and mobile devices.",
        fullDescription: "Managing a fleet of devices for a distributed workforce can be overwhelming. We take over the entire lifecycle of your end-user devices – from provisioning and deployment to security patching and final retirement. We ensure every employee has a fully configured, secure, and working device from day one.",
        icon: Laptop,
        process: [
            {
                title: "Procurement & Provisioning",
                description: "Sourcing devices and imaging them with your standard operating environment (SOE) and business applications."
            },
            {
                title: "Onboarding & Deployment",
                description: "Delivering ready-to-use devices directly to employees, complete with login credentials and access rights."
            },
            {
                title: "MDM Configuration",
                description: "Enrolling devices in Mobile Device Management (MDM) software for remote security and policy enforcement."
            },
            {
                title: "Patch Management & Support",
                description: "Automated updates for OS and software to protect against vulnerabilities, plus helpdesk support for hardware issues."
            },
            {
                title: "Retirement & E-Waste Recycling",
                description: "Secure data wiping and environmentally responsible recycling of old devices."
            }
        ],
        benefits: [
            "Seamless employee onboarding experience",
            "Improved security endpoint compliance",
            "Reduced IT workload for internal teams",
            "Predictable hardware refresh cycles"
        ]
    },
    {
        id: "it-maintenance-amc",
        title: "IT Maintenance & AMC",
        shortDescription: "Proactive maintenance contracts ensuring your infrastructure remains optimal and secure.",
        fullDescription: "Downtime costs money. Our Annual Maintenance Contracts (AMC) provide you with peace of mind knowing that your critical IT systems are being monitored and maintained proactively. We perform regular health checks, preventive maintenance, and priority repairs to catch issues before they disrupt your business operations.",
        icon: Settings,
        process: [
            {
                title: "Asset Audit",
                description: "Creating a comprehensive inventory of all hardware and software covered under the maintenance agreement."
            },
            {
                title: "Preventive Maintenance Schedule",
                description: "Establishing a calendar for routine tasks like server cleaning, disk defragmentation, and firmware updates."
            },
            {
                title: "24/7 Monitoring",
                description: "Deploying monitoring tools to track system health, uptime, and performance metrics in real-time."
            },
            {
                title: "On-Demand Repairs",
                description: "Priority response for hardware failures, including part replacement and on-site technician visits."
            },
            {
                title: "Quarterly Review",
                description: "Regular meetings to review system performance reports and discuss potential infrastructure upgrades."
            }
        ],
        benefits: [
            "Minimized unplanned downtime",
            "Extended hardware lifespan",
            "Predictable IT maintenance costs",
            "Priority support SLA"
        ]
    },
    {
        id: "managed-it-services",
        title: "Managed IT Services",
        shortDescription: "End-to-end outsourcing of your IT operations to our expert team.",
        fullDescription: "Focus on your core business while we handle the technology. Our Managed IT Services act as your virtual CIO and IT department. We align your technology strategy with your business goals, managing everything from cloud services and data backups to cybersecurity and vendor relationships.",
        icon: Shield,
        process: [
            {
                title: "Strategy & Consulting",
                description: "We analyze your business goals and create an IT roadmap to support them."
            },
            {
                title: "Cloud Management",
                description: "Managing your M365, AWS, or Azure environments for cost-efficiency and security."
            },
            {
                title: "Cybersecurity Management",
                description: "Implementing and managing endpoint protection, email security, and threat detection systems."
            },
            {
                title: "Data Backup & Recovery",
                description: "Automated daily backups and regular disaster recovery drills to ensure business continuity."
            },
            {
                title: "Vendor Management",
                description: "We handle all interactions with your internet, phone, and software vendors."
            }
        ],
        benefits: [
            "Enterprise-level IT expertise at a fraction of the cost",
            "Proactive risk management",
            "Scalable support that grows with you",
            "Single point of accountability"
        ]
    },
    {
        id: "on-site-remote-support",
        title: "On-site & Remote Support",
        shortDescription: "24/7 technical support to resolve issues rapidly and minimize downtime.",
        fullDescription: "Technology fails, but your business shouldn't. Our hybrid support model combines the speed of remote troubleshooting with the hands-on capability of on-site visits. Whether it's a forgotten password or a server crash, our helpdesk is just a phone call or click away, ensuring your team stays productive.",
        icon: Headphones,
        process: [
            {
                title: "Ticket Creation",
                description: "Users report issues via email, phone, or our self-service portal, automatically generating a tracked ticket."
            },
            {
                title: "Triage & Remote Fix",
                description: "L1 technicians attempt to resolve the issue remotely using secure desktop sharing tools."
            },
            {
                title: "Escalation",
                description: "Complex issues are escalated to L2/L3 engineers or subject matter experts."
            },
            {
                title: "On-Site Visit",
                description: "If a remote fix isn't possible, a technician is dispatched to your location within the agreed SLA."
            },
            {
                title: "Resolution & Feedback",
                description: "Issue is resolved, root cause is documented, and user satisfaction is verified before ticket closure."
            }
        ],
        benefits: [
            "Rapid response times",
            "Flexible support options (Remote/On-site)",
            "Detailed incident reporting",
            "Knowledge base creation for recurring issues"
        ]
    }
]
