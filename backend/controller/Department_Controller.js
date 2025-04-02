import * as departmentModel from '../models/department_model.js';
// Get Departments ...
export const load_AllDeparments = async (req, res) => {

    try {
        const departmentList = await departmentModel.getAllDepartments();
        // console.log('Load All Departments :', departmentList)
        res.status(200).json(departmentList);
    } catch (error) {
        console.log('Error Load_Departments :', error);
        res.status(500).send('Internal Server Error');
    }
}

// Insert Departments ...
export const Insert_Department = async (req, res) => {
    try {
        const { DepartmentData } = req.body;
        const result = await departmentModel.insertDepartment(DepartmentData);
        res.status(201).json(result);

    } catch (error) {
        console.error('Error fetching get_MasterByID :', error);
        res.status(500).send('Internal Server Error');
    }
}

// Update Department ...
export const Update_DepartmentByID = async (req, res) => {
    try {
        const { DepartmentData } = req.body;
        const result = await departmentModel.update_Department(DepartmentData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error Update_DepartmentByID :', error);
        res.status(500).send('Internal Server Error');
    }
}

// Delete Department ...
export const Delete_DepartmentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const rowsData = await departmentModel.delete_Department(id);
        res.status(200).json(rowsData);
    } catch (error) {
        console.error('Error Delete_DepartmentByID :', error);
        res.status(500).send('Internal Server Error');
    }
}