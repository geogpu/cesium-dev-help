
CREATE TABLE "public"."液化气管线" (
	"OBJECTID" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"LineNo" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"管线类别" VARCHAR ( 255 ) COLLATE "pg_catalog"."default", --PLtype
	"Ldescription" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Ldescription
	"Lcode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"起点编号" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--ExpNo1
	"终点编号" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--ExpNo2
	"起点埋深" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Deep1
	"终点埋深" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Deep2
	"起点X坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--ExpNo1
	"起点Y坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--ExpNo1
	"起点Z坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--ExpNo1
	"终点X坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Deep1
	"终点Y坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Deep2
	"终点Z坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Deep2
	"BType" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Material" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"管径" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Dsize
	"Cable" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Optical" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Hole" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Uhole" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Belong" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"BeCode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Bdate" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"LTCode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Road" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"DataSource" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"SurveyTeam" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Note_" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"ChangeMark" VARCHAR ( 255 ) COLLATE "pg_catalog"."default" 
);
CREATE TABLE "public"."液化气管点" (
	"OBJECTID" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"MapNo" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"管点编号" VARCHAR ( 255 ) COLLATE "pg_catalog"."default", --ExpNo
	"管线类别" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--PLtype
	"Pcode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"特征" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Feature
	"附属设施" VARCHAR ( 255 ) COLLATE "pg_catalog"."default", --Subsid
	"Material" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Spec" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"X坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--X
	"Y坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Y
	"X80" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Y80" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Z坐标" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",--Selev
	"Belong" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"BeCode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Bdate" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Scode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"MapCode" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Road" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"DataSource" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"SurveyTeam" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"Note_" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"ChangeMark" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"形状" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"WGS_X" VARCHAR ( 255 ) COLLATE "pg_catalog"."default",
	"WGS_Y" VARCHAR ( 255 ) COLLATE "pg_catalog"."default"
);

INSERT INTO "液化气管线" (
SELECT
	"OBJECTID",
	"LineNo",
	"PLtype" "管线类别",
	"Ldescription",
	"Lcode",
	"ExpNo1" "起点编号",--
	"ExpNo2" "终点编号",--
	"Deep1" "起点埋深",--
	"Deep2" "终点埋深",--
	st_x(ST_LineInterpolatePoint ( geom, 0 ))  "起点X坐标",
	st_y(ST_LineInterpolatePoint ( geom, 0 )) "起点Y坐标",
	st_z(ST_LineInterpolatePoint ( geom, 0 )) "起点Z坐标",
	st_x(ST_LineInterpolatePoint ( geom, 1 )) "终点X坐标",
	st_y(ST_LineInterpolatePoint ( geom, 1 )) "终点Y坐标",
	st_z(ST_LineInterpolatePoint ( geom, 1 )) "终点Z坐标",
	"BType",
	"Material",
	"Dsize" "管径",
-- 	"Cable",
-- 	"Optical",
-- 	"Hole",
-- 	"Uhole",
	"Belong",
	"BeCode",
	"Bdate",
	"LTCode",
	"Road",
	"DataSource",
	"SurveyTeam",
	"Note_",
	"ChangeMark" 
FROM
	"RQLine" WHERE "PLtype" = '液化气');
	
INSERT INTO "液化气管点" (
SELECT
"OBJECTID",
"MapNo",
"ExpNo" "管点编号", --ExpNo
"PLtype" "管线类别",--PLtype
"Pcode",
"Feature" "特征",--Feature
"Subsid" "附属设施", --Subsid
"Material",
"Spec",
"X" "X坐标",--X
"Y" "Y坐标",--Y
-- "X80",
-- "Y80",
"Selev" "Z坐标",--Selev
"Belong",
"BeCode",
"Bdate",
"Scode",
"MapCode",
"Road",
"DataSource",
"SurveyTeam",
"Note_",
"ChangeMark",
"形状",
"WGS_X" ,
"WGS_Y" 

FROM
	"RQPoint" WHERE "PLtype" ='液化气');