import User from "../models/User.js";

export async function updateItems(req, res) {
    const curruser = req?.user.id;
    const {changeItems} = req.body;

    try {
        if(!changeItems){
            return res.status(400).json( {message: "Items are required"} );
        }

        const user = await User.findById(curruser);

        if(!user){
            return res.status(404).json( {message: "User not found"} );
        }

        user.items.forEach(item => {
            if (changeItems.hasOwnProperty(item.name)) {
                const newQuantity = changeItems[item.name];
                item.quantity = newQuantity;
            }
        });
        await user.save();

        return res.status(200).json( {message: "User updated successfully", user} );
    } catch (error) {
        console.log(error.message)
        return res.status(500).json( {message: "Server error", error} );
    }
}

export async function addItem(req,res) {
    const {item}=req.body;
    const curruser = req.user.id;

    try {
        
        const user = await User.findById(curruser);

        if(!user){
            return res.status(404).json( {message: "User not found"} );
        }
        if(!req.body && req.body.length !=1){
            return res.status(400).json({message:"item is required or more or less than 1 item found"});
        }
        if(typeof req.body.item != 'string'){
            return res.status(400).json({message:"item is not a string"});
        }
        const existingItem=user.items.find(userItem=>userItem.name===item)
        if(existingItem){
            return res.status(400).json({message:'item already exist'});
        }

        user.items.push({
            name:item,
            quantity:1  
        });

        await user.save();

        return res.status(200).json( {message: "item successfully added", user} );

    } catch (error) {   
        return res.status(500).json( {message: "error adding item to the item list", error} );
    }

}

export async function newUpdateList(req,res) {

        const currUser=req.user.id;

        try {
            const user= await User.findById(currUser);

            if(!user){
                return res.status(404).json( {message: "User not found"} );
            }

            const updateUser=await User.findByIdAndUpdate(
                user,{
                    $pull:{
                        items:{quantity:{$lte:0}}
                    }
                },
                {new:true}
            ).select('-password');


            return res.status(200).json( {message: "item successfully updated",  user: updateUser} );

        } catch (error) {
            console.log(error.message)
            return res.status(500).json( {message: "Server error", error} );
        }
}

export async function newScore(req,res) {
    try {
        const currUser=req.user.id;
        const user=await User.findById(currUser);

        if(!user){
            return res.status(404).json( {message: "User not found"} );
        }

        const {bestScore}=req.body;
        user.score=bestScore;
        
        await user.save();

        return res.status(200).json( {message: "item successfully added", user} );
    } catch (error) {
        console.log(error.message)
        return res.status(500).json( {message: "Server error", error} );
    }
}

export async function otherUser(req,res){

    try {
        const currUser=req.user.id;
        const user=await User.findById(currUser);
        
        if(!user){
            return res.status(404).json( {message: "User not found"} );
        }

        const otherUsers= await User.find({
            $and: [
                {_id: {$ne: currUser}}
            ],
        }).select('-password');
        res.status(200).json(otherUsers);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json( {message: "Server error", error} );
    }
}