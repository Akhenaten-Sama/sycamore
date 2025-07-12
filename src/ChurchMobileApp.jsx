
import React from "react";
import { Typography, Row, Col, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ChurchMobileApp() {
  return (
	<div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
	  <Row justify="center" style={{ width: "100%" }}>
		<Col xs={24} sm={20} md={16} lg={12} xl={10} style={{ textAlign: "center", padding: "48px 0" }}>
		  <SmileOutlined style={{ fontSize: 64, color: "#1a365d", marginBottom: 24 }} />
		  <Title level={1} style={{ color: "#1a365d", fontWeight: 800, marginBottom: 16 }}>Welcome to Sycamore App</Title>
		  <Paragraph style={{ fontSize: 20, color: "#444", marginBottom: 32 }}>
			We're glad you're here! This is the official Sycamore Church app. Stay tuned for updates and new features.
		  </Paragraph>
		  <Button type="primary" size="large" style={{ borderRadius: 8, fontWeight: 600 }}>Learn More</Button>
		</Col>
	  </Row>
	</div>
  );
}

export default ChurchMobileApp;

