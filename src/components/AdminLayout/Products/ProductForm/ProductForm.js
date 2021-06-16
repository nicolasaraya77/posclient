import React, { useState } from "react";
import { Form, Button, Input, notification, InputNumber } from "antd";
import { useFormik } from "formik";
import useAuth from "../../../../hooks/useAuth";
import * as Yup from "yup";

import { addProduct, updateStore } from "../../../../api/products";

const ProductForm = (props) => {
  const { setShowModal, setReloadProducts, newProduct, product } = props;
  const [loading, setLoading] = useState(false);
  const { logout, store } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(product),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: (formData) => {
      newProduct ? createProduct(formData) : modifyProduct(formData);
    },
  });

  const createProduct = async (formData) => {
    console.log(formData);
    setLoading(true);
    const formDataTemp = {
      ...formData,
      almacen: store,
    };
    const response = await addProduct(formDataTemp, logout);
    formik.resetForm();

    if (!response) {
      notification["error"]({
        message: "error",
      });
      setLoading(false);
    } else {
      notification["success"]({
        message: "Producto creado",
      });
      setReloadProducts(true);
      setLoading(false);
      setShowModal(false);
    }
  };
  const modifyProduct = (formData) => {
    setLoading(true);
    const formDataTemp = {
      ...formData,
      almacen: store,
    };
    const response = updateStore(product.id, formDataTemp, logout);

    if (!response) {
      notification["error"]({
        message: "error",
      });
      setLoading(false);
    } else {
      formik.resetForm();
      notification["success"]({
        message: "Producto modificado",
      });
      setReloadProducts(true);
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Form onFinish={formik.handleSubmit}>
      <Form.Item name="name">
        <Input
          id="nombre"
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={formik.handleChange}
          value={formik.values.nombre}
        />
      </Form.Item>
      <Form.Item>
        <InputNumber
          id="precio_actual"
          name="precio_actual"
          placeholder="precio"
          onChange={formik.handleChange}
          value={formik.values.precio_actual}
        />
      </Form.Item>
      <Form.Item>
        <InputNumber
          id="stock_actual"
          name="stock_actual"
          placeholder="stock"
          onChange={formik.handleChange}
          value={formik.values.stock_actual}
        />
      </Form.Item>

      <div className="actions">
        <Button type="primary" htmlType="submit" loading={loading}>
          {newProduct ? "Crear producto" : "Actualizar producto"}
        </Button>
      </div>
    </Form>
  );
};

function initialValues(product) {
  return {
    nombre: product?.nombre || "",
    stock_actual: product?.stock_actual || "0",
    precio_actual: product?.precio_actual || "0",
  };
}

function validationSchema() {
  return {
    nombre: Yup.string().required(true),
  };
}

export default ProductForm;
