import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Item,
  Input,
  Text,
  DatePicker,
  View,
  Toast,
  Label,
  Textarea,
  Spinner,
} from "native-base";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {
  DocumentPicker,
  DocumentPickerUtil,
} from "react-native-document-picker";
import RNFetchBlob from "react-native-fetch-blob";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const items = [
  // this is the parent or "item"
  {
    name: "الشركات",
    id: 0,
    // these are the children or "sub items"
    children: [
      { id: "HRATSS", name: "شركة التقنية العربية لأنظمة المراقبة والحماية" },
      { id: "HRFutureCar", name: "شركة سيارات المستقبل للإستيراد والتصدير" },
      { id: "HRInvestment", name: "شركة المستقبل العربية للإستثمار" },
      { id: "HRIthmar", name: "شركة إثمار للصناعة والتوزيع" },
      { id: "HRFree", name: "(مناطق حرة)شركة القوقا التجارية" },
      { id: "HRQuqa", name: "شركة القوقا التجارية" },
    ],
  },
];

class AddNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      titleNew: "",
      subjectNews: "",
      selectedItems: [],
      pickerList: [],

      fileInfo: {
        fileUri: "",
        fileType: "",
        fileName: "",
        fileSize: "",
        fileData: "",
      },

      gottenID: 0,
      uploading: false,
      showSpinner: false,
    };

    this.setDate = this.setDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    // console.warn(selectedItems);
  };

  updateValues(text, field) {
    if (field === "title") {
      this.setState({
        titleNew: text,
      });
    } else if (field === "subject") {
      this.setState({
        subjectNews: text,
      });
    }
  }

  saveNewsButton() {
    if (this.state.titleNew !== "" && this.state.selectedItems !== []) {
      this.setState({ showSpinner: true });

      var url = API_LINK_PUBLIC + "Home/InsertNews";
      //console.warn(url);
      return fetch(url, {
        method: "Post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: this.state.titleNew,
          subject: this.state.subjectNews,
          dateTime: this.state.chosenDate
            .toString('dd"/"MM"/"yyyy')
            .substr(4, 12),
          dbs: this.state.selectedItems,
          fileUri: this.state.fileUri,
          fileType: this.state.fileType,
          fileName: this.state.fileName,
          fileSize: this.state.fileSize,
          fileData: this.state.fileData.toString(),
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData) {
            Toast.show({
              text: "تم الحفظ",
              type: "success",
              buttonText: "موافق",
              duration: 5000,
            });
             this.props.navigation.goBack();
          } else {
            Toast.show({
              text: " لم يتم الحفظ",
              type: "warning",
              duration: 5000,
            });
          }
          this.setState({ gottenID: responseData });
          //console.warn(responseData);
          return responseData;
        })
        .catch((error) => console.warn(error));
    } else {
      Toast.show({
        text: "الرجاء تعبئة الحقول",
        type: "danger",
        buttonText: "موافق",
        duration: 8000,
      });
    }
  }

  handleChange() {
    try {
      //Opening Document Picker
      DocumentPicker.show(
        {
          filetype: [DocumentPickerUtil.allFiles()],
          //All type of Files DocumentPickerUtil.allFiles()
          //Only PDF DocumentPickerUtil.pdf()
          //Audio DocumentPickerUtil.audio()
          //Plain Text DocumentPickerUtil.plainText()
        },
        (error, res) => {
          if (res != null) {
            this.setState({ fileUri: res.uri });
            this.setState({ fileType: res.type });
            this.setState({ fileName: res.fileName });
            this.setState({ fileSize: res.fileSize });

            RNFetchBlob.fs.readFile(res.uri, "base64").then((data) => {
              this.setState({ fileData: data });
            });
          }
        }
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
    //console.warn(RNFetchBlob.base64.encode(this.state.fileUri));
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-forward" />
            </Button>
          </Left>
          <Body>
            <Title>إضافة خبر</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Form>
            <Item regular>
              <Label>حدد الشركات</Label>
              <SectionedMultiSelect
                items={items}
                uniqueKey="id"
                subKey="children"
                selectText="إختر الشركات"
                showDropDowns={true}
                readOnlyHeadings={true}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
              />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Label>التاريخ</Label>
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date(2020, 1, 1)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="حدد التاريخ"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "black" }}
                onDateChange={this.setDate}
              />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Input
                style={{ textAlign: "right" }}
                onChangeText={(text) => this.updateValues(text, "title")}
                placeholder="عنوان الخبر"
              />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Textarea
                rowSpan={5}
                onChangeText={(text) => this.updateValues(text, "subject")}
                placeholder="موضوع الخبر"
              />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Left>
                <Button success onPress={() => this.handleChange()}>
                  <Text>إدراج ملف</Text>
                </Button>
              </Left>
              <Body>
                <Text style={{ textAlign: "right" }}>
                  {this.state.fileName}
                </Text>
              </Body>
            </Item>
            <View style={{ marginTop: 15 }} />
            <Button danger block onPress={() => this.saveNewsButton()}>
              <Icon active name="share" />
              <Text
                style={{
                  textAlign: "right",
                  padding: 10,
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                حــفـــــــظ
              </Text>
              {this.state.showSpinner ? <Spinner color="#FFF" /> : null}
            </Button>
            {/* <Button regular block style={{ margin: 15 }} onPress={() => this.saveNewsButton()}><Text style={{ fontWeight: "600"}}>حــفـــــــظ</Text></Button> */}
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AddNews;
