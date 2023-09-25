const { fuzzySearch } = require('../../utils');
const { Customer } = require('../../models');

async function getAll(req, res, next) {
  try {
    const payload = await Customer.find({ isDeleted: false });

    res.status(200).json({
      payload,
      message: "Lấy dánh sách thành công"
    });
  } catch (error) {
    res.status(400).json({
      error,
      message: "Lấy dánh sách không thành công"
    });
  }
};

async function create(req, res, next) {
  try {
    const { firstName, lastName, email, phoneNumber, address, password, birthday } = req.body;

    const newCustomer = new Customer({
      firstName, lastName, email, phoneNumber, address, password, birthday
    });

    const payload = await newCustomer.save();

    res.status(200).json({
      payload,
      message: "Tạo thành công"
    });
  } catch (error) {
    console.log('««««« error »»»»»', error);
    res.status(400).json({
      error,
      message: "Tạo không thành công"
    });
  }
};

async function search(req, res, next) {
  try {
    const { firstName, lastName, address, email } = req.query;
    const conditionFind = { isDeleted: false };

    if (firstName) conditionFind.firstName = fuzzySearch(firstName);
    if (lastName) conditionFind.lastName = fuzzySearch(lastName);
    if (address) conditionFind.address = fuzzySearch(address);
    if (email) conditionFind.email = fuzzySearch(email);

    const payload = await Customer.find(conditionFind);

    res.status(200).json({
      payload,
      message: "Tìm kiếm thành công"
    });
  } catch (error) {
    res.status(400).json({
      error,
      message: "Tìm kiếm không thành công"
    });
  }
};

async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const payload = await Customer.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!payload) {
      return res.status(400).json({
        message: "Không tìm thấy"
      });
    }

    return res.status(200).json({
      payload,
      message: "Xem chi tiết thành công"
    });
  } catch (error) {
    res.status(400).json({
      error,
      message: "Xem chi tiết không thành công"
    });
  }
};

async function update(req, res, next) {
  try {
    const { id } = req.params;

    const payload = await Customer.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true },
    );

    if (payload) {
      return res.status(200).json({
        payload,
        message: "Cập nhập thành công"
      });
    }
    return res.status(404).json({ message: "Không tìm thấy" });
  } catch (error) {
    console.log('««««« error »»»»»', error);
    res.status(400).json({
      error,
      message: "Cập nhập không thành công"
    });
  }
};

async function deleteFunc(req, res, next) {
  try {
    const { id } = req.params;

    const payload = await Customer.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (payload) {
      return res.status(200).json({
        payload,
        message: "Xóa thành công"
      });
    }

    return res.status(200).json({
      message: "Không tìm thấy danh mục"
    });
  } catch (error) {
    res.status(400).json({
      error,
      message: "Xóa không thành công"
    });
  }
};

module.exports = {
  getAll,
  create,
  search,
  getDetail,
  update,
  deleteFunc,
};
