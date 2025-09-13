# Capstone Project Proposal
### Team Members: Caitlyn Hartmann, Sophia Testa, Josh Prince, Aisha Ahammed  
9/2/2025

**Group Members**: Caitlyn Hartmann, Sophia Testa, Josh Prince, Aisha Ahammed 

### Problem Statement Description   
After speaking about possible software needs, our stakeholder, Superb Industries, came to us with a problem to solve: Inventory Management. Superb Industries is a progressive metal stamping company; this work entails maintaining and keeping track of die components in inventory and their condition. The problem identified includes discrepancies between inventory data and the physical inventory. Our stakeholder needs a more consistent system for storing and updating inventory data to mitigate these discrepancies. Our goal is to simplify tooling management by digitizing and automating the company’s data.  

### The Customer  

The customer is Daniel Miller, the operations manager for Superb Industries. Superb is a high-speed metal stamping company that runs and maintains progressive dies to produce highly specialized parts for customers in various industries. The customer’s objective is to manage the everyday operation of these dies securely and efficiently. This task includes ensuring the functionality of all the tooling in inventory and tending to any maintenance or repair needs as they arise. To do so efficiently, supporting a consistent, accurate, and complete view of the inventory is key.  

### The Users 

We want to provide an inventory management system to streamline viewing, updating, and maintaining crucial information for the everyday needs of our customers. The users who would interact with and update information stored in the inventory system would include the tool and die makers, engineers, and press technicians who service die components and replace worn out components. These users, about 10-15 individuals, would have a background in machining and CAD/CAM software. Between production runs, these users regularly service die components, which would be tracked with our proposed system. 

### Constraints 

Some user constraints include needing to operate on a PC hardware environment, Windows operating system, and in a Shop/warehouse user environment. These are the constraints we need to have in mind during the design and implementation development phases.  

### Assumptions and Risks   

Our customer has given us no constraints regarding the software framework we may choose in solving this problem, for that reason we assume that we can use the software frameworks that interest us. We must also assume that as an internal inventory system, our product will have high security needs. In designing our database, we make several assumptions about component compatibility and interaction. This means we assume that non-active components do not affect active component data and non-compatible components do not interact. We can verify all these assumptions in future stakeholder discussions. Invalid assumptions can have deep seeded effects on the system if they are taken into consideration early in the design process, so it is better to verify validity early on.  

### Assumptions List 

   - Assume chosen software framework works for customers (React/Flask)  

   - Assume high security needs (Login/Admin limitations)    

   - Ensure non-active components do not affect active component data.  

   - Ensure non-compatible components and dies do not interact.   

   - Assume multiple employees will have database permissions for 2FA.   

### Risks List 

   - Power outage  

   - User error  

   - Resource constraints  

   - Lack of customer feedback  

 

### Industry Specific Jargon  

   - Progressive Dies - metalworking tool used in a punch press to perform multiple operations, such as cutting, bending, and forming, on a continuous - strip of metal in a single automated pass 

   - Components - various parts that make up a complete die  

   - Punches/ inserts – cutting components used to cut a specific shape into material 

   - Forms – like punches and inserts, forms are used to form metal to specific shapes  

   - Shims - shims in progressive dies are used behind components after resharpening to achieve nominal height of the components 

   - Precision grinder - toolmaker who specializes in machinery such as surface grinder to achieve extremely precise tolerances  

   - Die specific punch depth - how deep the punch penetrates the die during the punching process 

   - Tooling- refers to the custom-designed, specialized implements, such as molds, dies, jigs, and fixtures, used to manufacture parts in industries like plastic injection molding and machining 