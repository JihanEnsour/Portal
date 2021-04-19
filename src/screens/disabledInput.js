import React, { Component } from "react";
import { Container } from "native-base";
import { Image } from "react-native";
import styles from "./styles";
import Onboarding from "react-native-onboarding-swiper";

class Disabled extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Onboarding
          onDone={() => this.props.navigation.goBack()}
          onSkip={() => this.props.navigation.goBack()}
          skipLabel="تـخطّ"
          nextLabel="التالي"
          pages={[
            {
              backgroundColor: "#46639E",
              image: <Image style={{ width: 170, height: 170 }} source={require("../../assets/tasksTabs/00.png")} />,
              title: "المهمات",
              subtitle: "تمكن الموظف من إرسال واستقبال المهامات من وإلى موظفي القسم أو الأقسام الأخرى.",
            },
            {
              backgroundColor: "#DC4A38",
              image: <Image source={require("../../assets/tasksTabs/11.png")} />,
              title: "المهمات المستلمة",
              subtitle: "المهمات التي استلمت من موظفي القسم أو الأقسام الأخرى.",
            },
            {
              backgroundColor: "#5cb85c",
              image: <Image source={require("../../assets/tasksTabs/22.png")} />,
              title: "المهمات المرسلة",
              subtitle: "المهمات التي قمت بإرسالها إلى موظفي القسم أو الأقسام الأخرى.",
            },
            {
              backgroundColor: "#777",
              image: <Image source={require("../../assets/tasksTabs/33.png")} />,
              title: "مهمات القسم",
              subtitle: "تمكن المدير من الإطلاع على المهام المستلمة من قبل موظفي قسمه وحالتها التنفيذية.",
            },
            {
              backgroundColor: "#46639E",
              image: <Image source={require("../../assets/tasksTabs/44.png")} />,
              title: "بيان الحالة",
              subtitle: "يمكنك تغيير حالة المهمة المستلمة حسب المرحلة التنفيذية.",
            },
            {
              backgroundColor: "#999",
              image: <Image source={require("../../assets/tasksTabs/55.png")} />,
              title: "تفاصيل المهمة المرسلة",
              subtitle: "تمكنك من معرفة حالة المهمة المرسلة مع إمكانية إلغاء وحذف المهمة.",
            },
          ]}
        />
      </Container>
    );
  }
}

export default Disabled;
