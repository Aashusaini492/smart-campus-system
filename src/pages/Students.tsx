
import React from "react"

const students = [
{ id:"CSE-001", name:"Aarav Sharma", dept:"CSE", year:"3rd" },
{ id:"CSE-002", name:"Priya Verma", dept:"CSE", year:"3rd" },
{ id:"CSE-003", name:"Rahul Singh", dept:"CSE", year:"3rd" },
{ id:"CSE-004", name:"Simran Kaur", dept:"CSE", year:"3rd" },
{ id:"CSE-005", name:"Aditya Gupta", dept:"CSE", year:"3rd" },
{ id:"CSE-006", name:"Sneha Patel", dept:"CSE", year:"3rd" },
{ id:"CSE-007", name:"Karan Mehta", dept:"CSE", year:"3rd" },
{ id:"CSE-008", name:"Neha Sharma", dept:"CSE", year:"3rd" },
{ id:"CSE-009", name:"Rohit Kumar", dept:"CSE", year:"3rd" },
{ id:"CSE-010", name:"Ananya Jain", dept:"CSE", year:"3rd" },

{ id:"CSE-011", name:"Vikas Yadav", dept:"CSE", year:"2nd" },
{ id:"CSE-012", name:"Pooja Singh", dept:"CSE", year:"2nd" },
{ id:"CSE-013", name:"Manish Verma", dept:"CSE", year:"2nd" },
{ id:"CSE-014", name:"Nikhil Gupta", dept:"CSE", year:"2nd" },
{ id:"CSE-015", name:"Riya Sharma", dept:"CSE", year:"2nd" },
{ id:"CSE-016", name:"Deepak Kumar", dept:"CSE", year:"2nd" },
{ id:"CSE-017", name:"Sakshi Patel", dept:"CSE", year:"2nd" },
{ id:"CSE-018", name:"Amit Singh", dept:"CSE", year:"2nd" },
{ id:"CSE-019", name:"Ankit Sharma", dept:"CSE", year:"2nd" },
{ id:"CSE-020", name:"Kajal Gupta", dept:"CSE", year:"2nd" },

{ id:"CSE-021", name:"Arjun Rampal", dept:"CSE", year:"1st" },
{ id:"CSE-022", name:"Payal Sharma", dept:"CSE", year:"1st" },
{ id:"CSE-023", name:"Ravi Patel", dept:"CSE", year:"1st" },
{ id:"CSE-024", name:"Nisha Gupta", dept:"CSE", year:"1st" },
{ id:"CSE-025", name:"Akash Yadav", dept:"CSE", year:"1st" },
{ id:"CSE-026", name:"Komal Singh", dept:"CSE", year:"1st" },
{ id:"CSE-027", name:"Varun Mehta", dept:"CSE", year:"1st" },
{ id:"CSE-028", name:"Sonia Jain", dept:"CSE", year:"1st" },
{ id:"CSE-029", name:"Harsh Kumar", dept:"CSE", year:"1st" },
{ id:"CSE-030", name:"Tanya Verma", dept:"CSE", year:"1st" }
]

export default function Students(){

return(

<div>

<h1 className="text-2xl font-bold mb-4">
Students List
</h1>

<table className="w-full border">

<thead className="bg-green-100">

<tr>
<th className="p-2 border">Student ID</th>
<th className="p-2 border">Name</th>
<th className="p-2 border">Department</th>
<th className="p-2 border">Year</th>
</tr>

</thead>

<tbody>

{students.map((s)=>(
<tr key={s.id}>

<td className="border p-2">{s.id}</td>
<td className="border p-2">{s.name}</td>
<td className="border p-2">{s.dept}</td>
<td className="border p-2">{s.year}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

