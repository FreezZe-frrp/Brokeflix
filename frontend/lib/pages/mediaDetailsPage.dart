import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/checkLogin.dart';
import '../widgets/bottomBar.dart';
import '../widgets/media_details.dart';
import '../widgets/arrowback.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MediaDetailsPage extends StatefulWidget {
  final String mediaType;
  final String mediaTitle;

  MediaDetailsPage(this.mediaType, this.mediaTitle, {Key? key})
      : super(key: key);

  @override
  MediaDetailsPageState createState() => MediaDetailsPageState();
}

class MediaDetailsPageState extends State<MediaDetailsPage> {
  late Future<dynamic> futureMediaDetails;

  Future<dynamic> fetchMediaDetails() async {
    var url = Uri.parse(
        'https://brokeflix-api.tech/api/${widget.mediaType}/?title=${Uri.encodeComponent(widget.mediaTitle)}');
    var response = await http.get(url);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load media details');
    }
  }

  @override
  void initState() {
    super.initState();
    futureMediaDetails = fetchMediaDetails();
  }

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: Size(375, 667),
      builder: (context, child) => Scaffold(
        backgroundColor: const Color(0xFF1C1C1C),
        body: FutureBuilder<dynamic>(
          future: futureMediaDetails,
          builder: (BuildContext context, AsyncSnapshot snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else if (snapshot.hasData) {
              var data = snapshot.data[0];
              return Stack(
                children: [
                  MediaDetailsWidget(
                    title: data['title'] ?? 'No title',
                    mediaTitle: widget.mediaTitle,
                    mediaType: widget.mediaType,
                    type: data['type'] ?? 'No type',
                    description: data['description'] ?? 'No description',
                    numberOfEpisodes: data['numberOfEpisodes'] ?? 'No episodes',
                    status: data['status'] ?? 'No status',
                    genres: (data['genres'] as List)
                        .map((item) => item.toString())
                        .toList(),
                    imageUrl: data['imageUrl'] ?? 'No image URL',
                    episode: widget.mediaType == 'animes' ||
                            widget.mediaType == 'series'
                        ? (data['episode'] != null
                            ? (data['episode'] as List)
                                .map((item) => item as Map<String, dynamic>)
                                .toList()
                            : [])
                        : [],
                    videoUrl: widget.mediaType == 'films' &&
                            data['videosUrl'] != null &&
                            data['videosUrl'] != 'Empty'
                        ? data['videosUrl']
                        : 'Empty',
                  ),
                  SafeArea(
                    child: Padding(
                      padding: EdgeInsets.all(16.w),
                      child: const ArrowBackWidget(),
                    ),
                  ),
                ],
              );
            } else {
              return CircularProgressIndicator();
            }
          },
        ),
        bottomNavigationBar: const BottomBar(),
      ),
    );
  }
}
