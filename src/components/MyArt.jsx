import Nav from "../pages/shared/Nav";
import useAuth from "../Hook/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyArt = () => {
  const [crafts, setCrafts] = useState();
  const [filteredCrafts, setFilteredCrafts] = useState([]);
  const { user } = useAuth() || {};


  


  const handleFilter = (e) => {
    const selectedValue = e.target.value;

    const newFilteredCrafts = crafts.filter(
      (craft) => craft.customization === selectedValue
    );
    setFilteredCrafts(newFilteredCrafts);
  };

  useEffect(() => {
    fetch(`https://art-server-delta.vercel.app/art-email/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCrafts(data);
        setFilteredCrafts(data);

       
      })
     
      .catch((err) => console.log(err.message));
  }, [user]);
 
  //delete
  const handleDelete = (_id) => {
    // console.log(_id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("delete confirm");

        fetch(`https://art-server-delta.vercel.app/art-craft/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your Art has been deleted.",
                icon: "success",
              });

              const remaining = crafts.filter((craft) => craft._id !== _id);
              setFilteredCrafts(remaining);
            }
          });

        
      }
    });
  };
 

  return (
    <div>
      <Nav></Nav>
      <div className="card card-side bg-base-100 shadow-xl grid grid-cols-1 mt-16">
        <h1 className="font-bold font-pop text-2xl text-center md:text-4xl">My Art & Craft List</h1>
        {/* filter */}
        <div className="flex items-center justify-center p-2 gap-4 mb-6">
          <span>Customization filter:</span>
          <select
            name="sort"
            onChange={handleFilter}
            className="border min-w-0 px-4 py-2 rounded-md bg-gray-200"
            defaultValue={""}
          >
            <option value="" disabled>
              Select Customization
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {/*  */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrafts.map((craft) => (
            <div
              key={craft._id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={craft.photo}
                alt={craft.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">Item Name: {craft.item}</h2>
                <p className="text-gray-700">Price: {craft.price}</p>
                <p>Rating: {craft.rating}</p>
                <p>Customization: {craft.customization}</p>
                <p>Stock Status: {craft.stock}</p>
              </div>
              <div className="p-4">
                <Link to={`/update/${craft._id}`}>
                  <button className="btn bg-green-600 text-white">
                    Update
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(craft._id)}
                  className="btn text-white bg-orange-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyArt;
